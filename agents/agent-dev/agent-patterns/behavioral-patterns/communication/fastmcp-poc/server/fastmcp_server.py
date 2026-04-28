from fastmcp import FastMCP

mcp = FastMCP("Demo Server")

@mcp.tool()
def add(a: int, b: int) -> int:
    return a + b

@mcp.resource("greeting://{name}")
def greet(name: str) -> str:
    return f"Hello, {name}!"

if __name__ == "__main__":
    mcp.run(transport="http", host="127.0.0.1", port=8000)
