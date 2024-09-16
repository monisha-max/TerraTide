from flask import Flask, request, jsonify
from researchtool import process_urls, handle_query

app = Flask(__name__)

@app.route('/process-urls', methods=['POST'])
def process_urls_endpoint():
    urls = request.json.get('urls', [])
    try:
        process_urls(urls)
        return jsonify({"status": "success"}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/query', methods=['POST'])
def query_endpoint():
    user_query = request.json.get('query', '')
    try:
        result = handle_query(user_query)
        return jsonify({"status": "success", "answer": result["answer"], "sources": result.get("sources", "")}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
