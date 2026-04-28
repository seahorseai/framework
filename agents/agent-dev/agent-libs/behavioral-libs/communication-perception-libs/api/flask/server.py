from flask import Flask, request
from flask_restful import Resource, Api

app = Flask(__name__)
api = Api(app)

items = []  # simple in-memory "database"

class Item(Resource):
    def get(self, name):
        for item in items:
            if item["name"] == name:
                return item, 200
        return {"message": "Item not found"}, 404

    def post(self, name):
        if any(item["name"] == name for item in items):
            return {"message": f"Item '{name}' already exists."}, 400

        data = request.get_json()
        new_item = {"name": name, "price": data.get("price")}
        items.append(new_item)
        return new_item, 201

class ItemList(Resource):
    def get(self):
        return {"items": items}, 200

api.add_resource(Item, "/item/<string:name>")
api.add_resource(ItemList, "/items")

if __name__ == "__main__":
    app.run(debug=True)
