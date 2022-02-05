// bb.generate({
//   bindto: "#chart",
//   data: {
//       columns: [
//           ["Penerimaan", 30, 200, 100, 170, 150, 250],
//           ["Pengeluaran", 130, 100, 140, 35, 110, 50]
//       ],
//       types: {
//         Penerimaan: "bar",
//         Pengeluaran: "bar"
//       },
//       colors: {
//         Penerimaan: "green",
//         Pengeluaran: "red"
//       }
//   }
// });

const labels = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
];

const data = {
  labels: labels,
  datasets: [{
    label: 'My First dataset',
    backgroundColor: 'rgb(255, 99, 132)',
    borderColor: 'rgb(255, 99, 132)',
    data: [100, 10, 5, 2, 20, 30, 45],
  }]
};

const config = {
  type: 'line',
  data: data,
  options: {}
};

const myChart = new Chart(
  document.getElementById('myChart'),
  config
);