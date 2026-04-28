from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    OPENAI_API_KEY: str
    ENCODING: str = "utf-8"
    EMBEDDING_MODEL: str = "text-embedding-3-small"
    CHAT_MODEL: str = "gpt-4o-mini"
    TEMPERATURE: int =0
    CHUNK_SIZE: int = 500
    CHUNK_OVERLAP: int = 50
    TOP_K: int = 3
    
    class Config:
        env_file = ".env"


settings = Settings()