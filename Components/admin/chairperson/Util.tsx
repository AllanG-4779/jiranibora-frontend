export const generateRandom = (low: number) => {
  let data = [];
  for (let i = 1; i <= 2; i++) {
    data.push({ day: i, amount: 10 + Math.random() * low });
  }
  return data;
};

export const items = [
  {
    name: "Chrispine Oyoo",
    position: "1",
    dob: "17 Mar 2022",
    phone: "+254796408343",
    ID: "389888999",
    age: 44,
    amount: 500,
    email: "chrispine@gmail.com",
    status: "Pending",
  },
  {
    name: "George Githae",
    ID: "389888999",
    dob: "17 Mar 2022",
    phone: "+254796408343",
    position: "2",
    age: 34,
    amount: 5030,
    email: "george@gmail.com",
    status: "Approved",
  },
  {
    name: "Evance Oduor",
    position: "3",
    dob: "17 Mar 2022",
    phone: "+254796408343",
    ID: "389888999",
    age: 21,
    amount: 3400,
    email: "evans@chris.com",
    status: "Cancelled",
  },
  {
    name: "Antonet Atieno",
    position: "4",
    age: 29,
    dob: "17 Mar 2022",
    phone: "+254796408343",
    amount: 2300,
    ID: "389888999",

    email: "antonet@gmail.com",
    status: "Approved",
  },
  {
    name: "Ghuyo Gulie",
    position: "5",
    dob: "17 Mar 2022",
    phone: "+254796408343",
    age: 67,
    amount: 15000,
    email: "chris@stupid.com",
    ID: "389888999",
    status: "Pending",
  },
];
