from html.parser import HTMLParser

class MyHTMLParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags = []
        self.void_elements = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']

    def handle_starttag(self, tag, attrs):
        if tag not in self.void_elements:
            self.tags.append((tag, self.getpos()))

    def handle_endtag(self, tag):
        if tag not in self.void_elements:
            if self.tags and self.tags[-1][0] == tag:
                self.tags.pop()
            else:
                print(f"Mismatched end tag: {tag} at line {self.getpos()[0]}, expected: {self.tags[-1][0] if self.tags else 'None'}")

parser = MyHTMLParser()
with open('/app/index.html', 'r') as f:
    parser.feed(f.read())
print("Unclosed tags:", parser.tags)
