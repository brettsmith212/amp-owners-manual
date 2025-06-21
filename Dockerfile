# ---------- build stage ----------
FROM rust:1.83-slim AS build
RUN apt-get update && apt-get install -y pkg-config libssl-dev \
    && rm -rf /var/lib/apt/lists/*
RUN cargo install mdbook --locked

# ---------- production stage ----------
FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && useradd -m -u 1000 mdbook

COPY --from=build /usr/local/cargo/bin/mdbook /usr/local/bin/mdbook
COPY book.toml /app/
COPY src/ /app/src/
COPY theme/ /app/theme/
RUN chown -R mdbook:mdbook /app
WORKDIR /app
USER mdbook
EXPOSE 3000
CMD ["mdbook", "serve", "-n", "0.0.0.0", "-p", "3000"]
