var DynamicDto = /** @class */ (function () {
    function DynamicDto(fields) {
        for (var key in fields) {
            if (fields.hasOwnProperty(key)) {
                this[key] = fields[key];
            }
        }
    }
    return DynamicDto;
}());
var userDto = new DynamicDto({ name: "Bob", age: 25 });
console.log(userDto.name); // Bob
console.log(userDto.age); // 25
