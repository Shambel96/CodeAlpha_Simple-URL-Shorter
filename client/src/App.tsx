import { useState } from "react";
import type { FormEvent } from "react";

interface ShortUrl {
  id: number;
  code: string;
  originalUrl: string;
  clicks: number;
}

function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function isValidUrl(value: string) {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setShortUrl("");

    if (!isValidUrl(url)) {
      setError("Please provide a valid URL");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/urls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Something went wrong");
      }

      const data: ShortUrl = result.data;

      setShortUrl(`http://localhost:3000/${data.code}`);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(shortUrl);
  }

  return (
    <main className="container">
      <div className="card">
        <h1>URL Shortener</h1>

        <p className="description">
          Turn your long URLs into short, shareable links.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="url"
            placeholder="https://example.com/very/long/url"
            value={url}
            onChange={(event) => {
              setUrl(event.target.value);
              setError("");
            }}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Shortening..." : "Shorten URL"}
          </button>
        </form>

        {error && <div className="error">{error}</div>}

        {shortUrl && (
          <div className="result">
            <p>Your shortened URL:</p>

            <div className="short-url">
              <a href={shortUrl} target="_blank" rel="noreferrer">
                {shortUrl}
              </a>

              <button type="button" onClick={handleCopy}>
                Copy
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default App;
