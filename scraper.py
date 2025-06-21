#!/usr/bin/env python3
"""
Improved web scraper for ampcode.com/manual
Extracts full documentation with proper markdown formatting
"""

import requests
from bs4 import BeautifulSoup
import re
from urllib.parse import urljoin
import sys


def clean_text(text):
    """Clean and normalize text content"""
    if not text:
        return ""

    # Remove extra whitespace and normalize
    text = re.sub(r"\s+", " ", text.strip())

    # Fix common formatting issues
    text = text.replace("&amp;", "&")
    text = text.replace("&lt;", "<")
    text = text.replace("&gt;", ">")
    text = text.replace("&quot;", '"')

    return text


def process_code_blocks(element):
    """Process code blocks and preserve formatting"""
    code_blocks = element.find_all(["pre", "code"])
    for code in code_blocks:
        if code.name == "pre":
            # Handle pre blocks
            code_content = code.get_text()
            language = ""

            # Try to detect language from class
            if code.get("class"):
                for cls in code.get("class"):
                    if cls.startswith("language-"):
                        language = cls.replace("language-", "")
                        break

            code.replace_with(f"\n```{language}\n{code_content}\n```\n")
        else:
            # Handle inline code
            code.replace_with(f"`{code.get_text()}`")


def convert_links(element, base_url):
    """Convert links to proper markdown format"""
    links = element.find_all("a")
    for link in links:
        href = link.get("href", "")
        text = clean_text(link.get_text())

        if not text:
            continue

        if href.startswith("#"):
            # Internal anchor link
            link.replace_with(f"[{text}]({href})")
        elif href.startswith("/"):
            # Relative link
            full_url = urljoin(base_url, href)
            link.replace_with(f"[{text}]({full_url})")
        elif href.startswith("http"):
            # Absolute link
            link.replace_with(f"[{text}]({href})")
        else:
            # Other cases
            link.replace_with(text)


def process_lists(element):
    """Convert HTML lists to markdown"""
    lists = element.find_all(["ul", "ol"])
    for list_elem in lists:
        items = list_elem.find_all("li", recursive=False)
        markdown_items = []

        for i, item in enumerate(items):
            item_text = clean_text(item.get_text())
            if list_elem.name == "ol":
                prefix = f"{i + 1}. "
            else:
                prefix = "* "
            markdown_items.append(f"{prefix}{item_text}")

        list_elem.replace_with("\n" + "\n".join(markdown_items) + "\n")


def process_tables(element):
    """Convert HTML tables to markdown"""
    tables = element.find_all("table")
    for table in tables:
        rows = table.find_all("tr")
        if not rows:
            continue

        markdown_table = []

        for i, row in enumerate(rows):
            cells = row.find_all(["th", "td"])
            cell_texts = [clean_text(cell.get_text()) for cell in cells]
            markdown_row = "| " + " | ".join(cell_texts) + " |"
            markdown_table.append(markdown_row)

            # Add separator after header row
            if i == 0 and row.find("th"):
                separator = "| " + " | ".join(["---"] * len(cells)) + " |"
                markdown_table.append(separator)

        table.replace_with("\n" + "\n".join(markdown_table) + "\n")


def extract_content_section(soup, base_url):
    """Extract and convert the main content to markdown"""

    # Find the main content area
    main_content = (
        soup.find("main")
        or soup.find("article")
        or soup.find("div", class_=re.compile(r"content|main|body"))
    )

    if not main_content:
        # Fallback: try to find content by looking for headings
        main_content = soup.find("body")

    if not main_content:
        return "Could not find main content area"

    # Make a copy to work with
    content = BeautifulSoup(str(main_content), "html.parser")

    # Remove navigation, headers, footers, and other non-content elements
    for element in content.find_all(
        ["nav", "header", "footer", "aside", "script", "style"]
    ):
        element.decompose()

    # Remove elements with certain classes
    for element in content.find_all(
        class_=re.compile(r"nav|menu|sidebar|footer|header|toc")
    ):
        element.decompose()

    # Process the content recursively to build markdown
    return process_element_to_markdown(content, base_url)


def process_element_to_markdown(element, base_url, depth=0):
    """Recursively process HTML elements and convert to markdown"""
    if element is None:
        return ""

    # Handle text nodes
    if element.name is None:
        text = clean_text(str(element))
        return text if text else ""

    result = ""

    # Handle different HTML elements
    if element.name in ["h1", "h2", "h3", "h4", "h5", "h6"]:
        level = int(element.name[1])
        text = clean_text(element.get_text())
        if text:
            result = f"\n\n{'#' * level} {text}\n\n"

    elif element.name == "p":
        text = clean_text(element.get_text())
        if text:
            result = f"\n{text}\n\n"

    elif element.name == "pre":
        code_content = element.get_text()
        language = ""

        # Try to detect language from class
        if element.get("class"):
            for cls in element.get("class"):
                if cls.startswith("language-"):
                    language = cls.replace("language-", "")
                    break

        result = f"\n```{language}\n{code_content}\n```\n\n"

    elif element.name == "code" and element.parent.name != "pre":
        result = f"`{element.get_text()}`"

    elif element.name == "a":
        href = element.get("href", "")
        text = clean_text(element.get_text())

        if text:
            if href.startswith("#"):
                result = f"[{text}]({href})"
            elif href.startswith("/"):
                full_url = urljoin(base_url, href)
                result = f"[{text}]({full_url})"
            elif href.startswith("http"):
                result = f"[{text}]({href})"
            else:
                result = text
        else:
            result = ""

    elif element.name in ["em", "i"]:
        text = clean_text(element.get_text())
        if text:
            result = f"*{text}*"

    elif element.name in ["strong", "b"]:
        text = clean_text(element.get_text())
        if text:
            result = f"**{text}**"

    elif element.name == "ul":
        items = []
        for li in element.find_all("li", recursive=False):
            item_content = process_element_to_markdown(li, base_url, depth + 1)
            if item_content.strip():
                items.append(f"* {item_content.strip()}")

        if items:
            result = f"\n{chr(10).join(items)}\n\n"

    elif element.name == "ol":
        items = []
        for i, li in enumerate(element.find_all("li", recursive=False), 1):
            item_content = process_element_to_markdown(li, base_url, depth + 1)
            if item_content.strip():
                items.append(f"{i}. {item_content.strip()}")

        if items:
            result = f"\n{chr(10).join(items)}\n\n"

    elif element.name == "li":
        # Process children of list item
        child_content = ""
        for child in element.children:
            child_content += process_element_to_markdown(child, base_url, depth + 1)
        result = child_content.strip()

    elif element.name == "table":
        rows = element.find_all("tr")
        if rows:
            table_lines = []

            for i, row in enumerate(rows):
                cells = row.find_all(["th", "td"])
                cell_texts = []
                for cell in cells:
                    cell_text = clean_text(cell.get_text())
                    cell_texts.append(cell_text)

                if cell_texts:
                    table_line = "| " + " | ".join(cell_texts) + " |"
                    table_lines.append(table_line)

                    # Add separator after header row
                    if i == 0 and row.find("th"):
                        separator = "| " + " | ".join(["---"] * len(cells)) + " |"
                        table_lines.append(separator)

            if table_lines:
                result = f"\n{chr(10).join(table_lines)}\n\n"

    elif element.name == "br":
        result = "\n"

    elif element.name in ["div", "section", "article"]:
        # Process children recursively for container elements
        child_content = ""
        for child in element.children:
            child_content += process_element_to_markdown(child, base_url, depth)
        result = child_content

    else:
        # For other elements, process children recursively
        child_content = ""
        for child in element.children:
            child_content += process_element_to_markdown(child, base_url, depth)
        result = child_content

    return result


def scrape_manual(url):
    """Main scraping function"""
    print(f"Fetching {url}...")

    try:
        headers = {"User-Agent": "Mozilla/5.0 (compatible; Documentation Scraper)"}
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()

        soup = BeautifulSoup(response.content, "html.parser")

        # Extract title
        title = soup.find("title")
        title_text = clean_text(title.get_text()) if title else "Amp Owner's Manual"

        # Extract main content
        content = extract_content_section(soup, url)

        # Clean up the content formatting
        content = re.sub(r"\n{3,}", "\n\n", content)  # Remove excessive newlines
        content = re.sub(r"[ \t]+", " ", content)  # Normalize spaces and tabs
        content = content.strip()

        # Combine into final markdown
        markdown_content = f"# {title_text}\n\n{content}"

        return markdown_content

    except requests.RequestException as e:
        print(f"Error fetching URL: {e}")
        return None
    except Exception as e:
        print(f"Error processing content: {e}")
        return None


def main():
    url = "https://ampcode.com/manual"
    output_file = "amp-manual-complete.md"

    markdown_content = scrape_manual(url)

    if markdown_content:
        with open(output_file, "w", encoding="utf-8") as f:
            f.write(markdown_content)

        print(f"Successfully scraped content to {output_file}")
        print(f"Content length: {len(markdown_content)} characters")
    else:
        print("Failed to scrape content")
        sys.exit(1)


if __name__ == "__main__":
    main()
