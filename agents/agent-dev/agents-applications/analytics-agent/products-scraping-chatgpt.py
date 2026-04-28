from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
import time

# ----------------------------
# Config
# ----------------------------
BASE_URL = "https://shop.deere.com"
START_URL = f"{BASE_URL}/us/ShopAllCategories"
WAIT_TIMEOUT = 10
PAGE_LOAD_DELAY = 5


# ----------------------------
# Setup
# ----------------------------
def setup_driver() -> webdriver.Chrome:
    """Initialize a stealth Selenium Chrome driver."""
    options = Options()
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("start-maximized")
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_experimental_option("useAutomationExtension", False)
    options.add_argument(
        "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    )
    driver = webdriver.Chrome(options=options)
    return driver


def normalize_url(href: str) -> str:
    """Convert relative hrefs to absolute URLs."""
    if not href:
        return ""
    return href if href.startswith("http") else f"{BASE_URL}{href}"


# ----------------------------
# Scraping Helpers
# ----------------------------
def extract_links_from_thumbs(soup: BeautifulSoup) -> list[dict]:
    """Extract category/subcategory links from .thumb divs."""
    categories = []
    for div in soup.find_all("div", class_="thumb"):
        links = div.find_all("a")
        if len(links) >= 2:
            link = links[1]
            url = normalize_url(link.get("href"))
            text = link.get_text(strip=True)
            categories.append({"text": text, "href": url})
    return categories


def get_categories(driver: webdriver.Chrome) -> list[dict]:
    """Scrape all main categories from the start page."""
    driver.get(START_URL)
    time.sleep(PAGE_LOAD_DELAY)
    soup = BeautifulSoup(driver.page_source, "html.parser")
    return extract_links_from_thumbs(soup)


def get_subcategories(driver: webdriver.Chrome, category: dict, seen: set) -> list[dict]:
    """Scrape subcategories for a given main category."""
    driver.get(category["href"])
    time.sleep(3)
    soup = BeautifulSoup(driver.page_source, "html.parser")
    subcategories = []

    for sub in extract_links_from_thumbs(soup):
        if sub["href"] not in seen:
            seen.add(sub["href"])
            sub["parent"] = category["text"]
            subcategories.append(sub)

    return subcategories


def get_products(driver: webdriver.Chrome, subcategory: dict) -> list[dict]:
    """Scrape products from a given subcategory page."""
    driver.get(subcategory["href"])
    time.sleep(PAGE_LOAD_DELAY)

    try:
        WebDriverWait(driver, WAIT_TIMEOUT).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "a[href*='/product/']"))
        )
    except Exception:
        print(f"⚠️ No products loaded in {subcategory['href']}")

    soup = BeautifulSoup(driver.page_source, "html.parser")
    products = []

    # Strategy 1: direct product links
    product_links = soup.find_all("a", href=lambda x: x and "/product/" in x)

    # Strategy 2: common product selectors
    if not product_links:
        selectors = [
            "a[data-testid*='product']",
            ".product-card a",
            ".ProductCard a",
            "div[class*='product'] a",
            "div[class*='Product'] a",
        ]
        for selector in selectors:
            product_links = soup.select(selector)
            if product_links:
                break

    # Strategy 3: fallback to product-like containers
    if not product_links:
        containers = soup.find_all(
            "div",
            class_=lambda c: c and any(
                kw in c.lower() for kw in ["product", "card", "item", "tile"]
            ),
        )
        for c in containers:
            product_links.extend(c.find_all("a", href=True))

    # Deduplicate and normalize
    seen = set()
    for link in product_links:
        url = normalize_url(link.get("href"))
        if not url or url in seen:
            continue
        if "/product/" not in url and "productId=" not in url:
            continue
        seen.add(url)

        name = (
            link.get_text(strip=True)
            or link.get("title")
            or link.get("aria-label")
            or "Unnamed Product"
        )
        if len(name) > 100:
            name = f"{name[:100]}..."

        products.append({"name": name, "url": url})

    return products


# ----------------------------
# Main Flow
# ----------------------------
def main():
    driver = setup_driver()
    try:
        categories = get_categories(driver)
        print(f"✅ Found {len(categories)} main categories")

        all_subcategories = []
        seen_sub_urls = set()
        for category in categories[:2]:  # limit for testing
            subcategories = get_subcategories(driver, category, seen_sub_urls)
            all_subcategories.extend(subcategories)
            print(f"📂 {category['text']} -> {category['href']}: {len(subcategories)} subcategories")

        for sub in all_subcategories[:2]:  # limit for testing
            products = get_products(driver, sub)
            print(f"\n🛒 {sub['text']} -> {sub['href']}: {len(products)} products")
            for p in products:  # show only first few
                print(f"   - {p['name']} -> {p['url']}")

    finally:
        driver.quit()


if __name__ == "__main__":
    main()
