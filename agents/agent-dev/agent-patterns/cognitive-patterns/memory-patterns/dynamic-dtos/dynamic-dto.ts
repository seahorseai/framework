class DynamicDto {
  [key: string]: any;

  constructor(fields: Record<string, any>) {
    for (const key in fields) {
      if (fields.hasOwnProperty(key)) {
        this[key] = fields[key];
      }
    }
  }
}

const userDto = new DynamicDto({ name: "Bob", age: 25 });
console.log(userDto.name); // Bob
console.log(userDto.age); // 25
