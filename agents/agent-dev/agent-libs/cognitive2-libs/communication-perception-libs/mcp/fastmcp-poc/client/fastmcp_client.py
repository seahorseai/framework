# fastmcp_client.py
import asyncio
from fastmcp import Client

async def main():
    # Connect to the running server
    client = Client("http://127.0.0.1:8000/mcp")

    async with client:
        # Optionally, ping server
        await client.ping()

        # Call a tool
        result = await client.call_tool("add", {"a": 5, "b": 3})
        print("add(5, 3) =", result.data)

if __name__ == "__main__":
    asyncio.run(main())