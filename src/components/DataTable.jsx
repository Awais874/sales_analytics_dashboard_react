
// function DataTable({ data }) {
//   return (
//     <div style={{ marginTop: "30px", width: "100%", overflowX: "auto" }}>
//       <table
//         style={{
//           width: "100%",
//           borderCollapse: "collapse",
//           background: "#fff",
//           boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
//           borderRadius: "12px",
//           overflow: "hidden",
//           minWidth: "800px", // ensures table doesn't shrink too much
//         }}
//       >
//         <thead
//           style={{
//             background: "#f0f4f8",
//             color: "#333",
//             fontWeight: "600",
//             textAlign: "left",
//           }}
//         >
//           <tr>
//             <th style={{ padding: "12px 15px" }}>Order ID</th>
//             <th style={{ padding: "12px 15px" }}>Order Date</th>
//             <th style={{ padding: "12px 15px" }}>Region</th>
//             <th style={{ padding: "12px 15px" }}>Category</th>
//             <th style={{ padding: "12px 15px" }}>Sub Category</th>
//             <th style={{ padding: "12px 15px", textAlign: "right" }}>Sales</th>
//             <th style={{ padding: "12px 15px", textAlign: "right" }}>Quantity</th>
//             <th style={{ padding: "12px 15px", textAlign: "right" }}>Profit</th>
//           </tr>
//         </thead>

//         <tbody>
//           {data.slice(0, 20).map((row, index) => (
//             <tr
//               key={index}
//               style={{
//                 background: index % 2 === 0 ? "#fff" : "#f9fafb",
//                 transition: "background 0.3s",
//                 cursor: "default",
//               }}
//               onMouseEnter={(e) => (e.currentTarget.style.background = "#e6f7ff")}
//               onMouseLeave={(e) =>
//                 (e.currentTarget.style.background =
//                   index % 2 === 0 ? "#fff" : "#f9fafb")
//               }
//             >
//               <td style={{ padding: "12px 15px" }}>{row["Order ID"]}</td>
//               <td style={{ padding: "12px 15px" }}>{row["Order Date"]}</td>
//               <td style={{ padding: "12px 15px" }}>{row["Region"]}</td>
//               <td style={{ padding: "12px 15px" }}>{row["Category"]}</td>
//               <td style={{ padding: "12px 15px" }}>{row["Sub-Category"]}</td>
//               <td style={{ padding: "12px 15px", textAlign: "right" }}>
//                 ${parseFloat(row["Sales"]).toLocaleString()}
//               </td>
//               <td style={{ padding: "12px 15px", textAlign: "right" }}>
//                 {row["Quantity"]}
//               </td>
//               <td style={{ padding: "12px 15px", textAlign: "right" }}>
//                 ${parseFloat(row["Profit"]).toLocaleString()}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default DataTable;











function DataTable({ data }) {
  return (
    <div style={{ marginTop: "30px", width: "100%", overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#fff",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          borderRadius: "12px",
          overflow: "hidden",
          minWidth: "600px", // adjusted since fewer columns
        }}
      >
        <thead
          style={{
            background: "#f0f4f8",
            color: "#333",
            fontWeight: "600",
            textAlign: "left",
          }}
        >
          <tr>
            <th style={{ padding: "12px 15px" }}>Order ID</th>
            <th style={{ padding: "12px 15px" }}>Order Date</th>
            <th style={{ padding: "12px 15px" }}>Region</th>
            <th style={{ padding: "12px 15px" }}>Category</th>
            <th style={{ padding: "12px 15px" }}>Sub Category</th>
            <th style={{ padding: "12px 15px", textAlign: "right" }}>Sales</th>
          </tr>
        </thead>

        <tbody>
          {data.slice(0, 20).map((row, index) => (
            <tr
              key={index}
              style={{
                background: index % 2 === 0 ? "#fff" : "#f9fafb",
                transition: "background 0.3s",
                cursor: "default",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#e6f7ff")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.background =
                  index % 2 === 0 ? "#fff" : "#f9fafb")
              }
            >
              <td style={{ padding: "12px 15px" }}>{row["Order ID"]}</td>
              <td style={{ padding: "12px 15px" }}>{row["Order Date"]}</td>
              <td style={{ padding: "12px 15px" }}>{row["Region"]}</td>
              <td style={{ padding: "12px 15px" }}>{row["Category"]}</td>
              <td style={{ padding: "12px 15px" }}>{row["Sub-Category"]}</td>
              <td style={{ padding: "12px 15px", textAlign: "right" }}>
                ${parseFloat(row["Sales"]).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;