import time
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph
from langgraph.constants import END
from typing import TypedDict, List, Optional


# ---------- Step 1: TypedDicts ----------
class PartDetail(TypedDict, total=False):
    title: str
    url: str
    description: Optional[str]
    part_number: Optional[str]
    image_url: Optional[str]


class ScrapedData(TypedDict):
    query: str
    results: List[PartDetail]


class AgentState(TypedDict, total=False):
    user_request: Optional[str]
    query: str
    scraped_data: ScrapedData
    summary: str


# ---------- Step 2: Selenium Setup ----------
def get_driver():
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    return webdriver.Chrome(options=options)


# ---------- Step 3: Scraper Functions ----------
def scrape_search_page(query: str) -> ScrapedData:
    """Scrape Deere catalog search results and click into each part page."""
    base_url = "https://partscatalog.deere.com"
    search_url = f"{base_url}/jdrc/search/type/parts/term/{query.replace(' ', '%20')}"

    driver = get_driver()
    try:
        driver.get(search_url)
        time.sleep(5)
        soup = BeautifulSoup(driver.page_source, "html.parser")

        results: List[PartDetail] = []

        # Collect search result links
        links = []
        for a in soup.select("a[href]"):
            href = a.get("href")
            title = a.get_text(strip=True)
            if href and title and "/jdrc/part" in href:  # heuristic: part detail links
                full_url = href if href.startswith("http") else base_url + href
                links.append((title, full_url))

        # Limit results to avoid overload
        for title, url in links[:5]:
            details = scrape_part_detail(url, driver)
            details["title"] = title
            details["url"] = url
            results.append(details)

        return {"query": query, "results": results}

    finally:
        driver.quit()


def scrape_part_detail(url: str, driver: webdriver.Chrome) -> PartDetail:
    """Extract deeper details from a part page."""
    driver.get(url)
    time.sleep(3)
    soup = BeautifulSoup(driver.page_source, "html.parser")

    # Title
    title = soup.find("h1")
    part_title = title.get_text(strip=True) if title else None

    # Part number (example heuristic)
    part_number = None
    pn_el = soup.find("span", {"class": "part-number"})
    if pn_el:
        part_number = pn_el.get_text(strip=True)

    # Description
    description = None
    desc_el = soup.find("div", {"class": "description"}) or soup.find("p")
    if desc_el:
        description = desc_el.get_text(strip=True)

    # Image
    image_url = None
    img = soup.find("img")
    if img and img.get("src"):
        image_url = img["src"]
        if image_url.startswith("/"):
            image_url = "https://partscatalog.deere.com" + image_url

    return {
        "title": part_title,
        "part_number": part_number,
        "description": description,
        "image_url": image_url,
        "url": url,
    }


# ---------- Step 4: Agent Nodes ----------
def interpret_request(state: AgentState) -> dict:
    query = state.get("user_request")
    if not query:
        query = "air filter"
    return {"query": query}


def scrape_node(state: AgentState) -> dict:
    query = state["query"]
    data = scrape_search_page(query)
    return {"scraped_data": data}


def summarize_results(state: AgentState) -> dict:
    llm = ChatOpenAI(model="gpt-4o-mini")
    scraped = state["scraped_data"]
    summary = llm.predict(
        f"Summarize these John Deere part details in plain language:\n{scraped}"
    )
    return {"summary": summary}


# ---------- Step 5: Build LangGraph ----------
graph = StateGraph(AgentState)

graph.add_node("interpret_request", interpret_request)
graph.add_node("scrape", scrape_node)
graph.add_node("summarize", summarize_results)


graph.set_entry_point("interpret_request")  # start here
graph.add_edge("interpret_request", "scrape")
graph.add_edge("scrape", "summarize")
graph.add_edge("summarize", END)

agent = graph.compile()


# ---------- Step 6: Run Agent ----------
if __name__ == "__main__":
    final_state: AgentState = agent.invoke(
        {"user_request": "air filter for John Deere 5105"}
    )
    print("\n🔎 Raw Scraped Data:")
    for part in final_state["scraped_data"]["results"]:
        print(
            f"- {part.get('part_number')} | {part['title']} "
            f"({part['url']}) :: {part.get('description')} "
            f"[Image: {part.get('image_url')}]"
        )
    print("\n📝 Summary:", final_state["summary"])
