from pathlib import Path
from types import SimpleNamespace
import sys

import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import main
from supabase_auth import get_current_user


class FakeMessages:
    def __init__(self, text: str):
        self.text = text

    async def create(self, **_kwargs):
        return SimpleNamespace(content=[SimpleNamespace(text=self.text)])


class FakeAI:
    def __init__(self, text: str):
        self.messages = FakeMessages(text)


@pytest.fixture
def client():
    main.app.dependency_overrides[get_current_user] = lambda: {"sub": "user-test"}
    with TestClient(main.app) as test_client:
        yield test_client
    main.app.dependency_overrides.clear()
    main._request_windows.clear()


def test_generate_requires_authentication():
    response = TestClient(main.app).post("/generate-code", json={"request": "Crea una función"})
    assert response.status_code == 401


def test_generate_validates_and_returns_structured_output(client, monkeypatch):
    monkeypatch.setattr(main, "ai_client", FakeAI('{"title":"Suma","code":"def suma(a, b): return a + b","explanation":"Suma dos valores.","suggested_tests":["Prueba 1 + 2"]}'))
    response = client.post("/generate-code", json={"request": "Crea una función suma", "language": "python"})
    assert response.status_code == 200
    assert response.json()["title"] == "Suma"
    assert response.json()["suggested_tests"] == ["Prueba 1 + 2"]


def test_generate_rejects_invalid_provider_json(client, monkeypatch):
    monkeypatch.setattr(main, "ai_client", FakeAI("no es json"))
    response = client.post("/generate-code", json={"request": "Crea una función suma"})
    assert response.status_code == 502
    assert "formato no válido" in response.json()["detail"]


def test_generate_rejects_oversized_request(client):
    response = client.post("/generate-code", json={"request": "x" * 6001})
    assert response.status_code == 422


def test_github_requires_backend_token(client, monkeypatch):
    monkeypatch.setattr(main, "GITHUB_TOKEN", None)
    response = client.get("/github/repositories")
    assert response.status_code == 503
