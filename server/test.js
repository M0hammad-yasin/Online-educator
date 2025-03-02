const req = {
  body: {
    name: "test",
    // email: "test",
    profilePicture: "test",
    isEmailVerified: true,
  },
};
const number = 345678;
console.log(typeof number.toString());
const data = String(number);
console.log(typeof number);
console.log(typeof data);
