import { useState } from "react";

export default function UpdateOrder() {
  const [id, setId] = useState("");
  const [formData, setFormData] = useState({
    Customer_Name: "",
    Region: "",
    Category: "",
    Product_Name: "",
    Sales: "",
  });

  const [message, setMessage] = useState("");
  const [updatedOrder, setUpdatedOrder] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("");
    setUpdatedOrder(null);

    try {
      const response = await fetch(`http://localhost:5001/api/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to update order");
      }

      setMessage("Order updated successfully.");
      setUpdatedOrder(data);

      setFormData({
        Customer_Name: "",
        Region: "",
        Category: "",
        Product_Name: "",
        Sales: "",
      });
      setId("");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Update Order</h2>

      <form
        onSubmit={handleUpdate}
        style={{ display: "grid", gap: "10px", maxWidth: "500px" }}
      >
        <input
          name="id"
          placeholder="MongoDB _id"
          value={id}
          onChange={(e) => setId(e.target.value)}
          required
        />

        <input
          name="Customer_Name"
          placeholder="Customer_Name"
          value={formData.Customer_Name}
          onChange={handleChange}
        />

        <input
          name="Region"
          placeholder="Region"
          value={formData.Region}
          onChange={handleChange}
        />

        <input
          name="Category"
          placeholder="Category"
          value={formData.Category}
          onChange={handleChange}
        />

        <input
          name="Product_Name"
          placeholder="Product_Name"
          value={formData.Product_Name}
          onChange={handleChange}
        />

        <input
          name="Sales"
          placeholder="Sales"
          value={formData.Sales}
          onChange={handleChange}
        />

        <button type="submit">Update Order</button>
      </form>

      {message && <p>{message}</p>}

      {updatedOrder && (
        <div style={{ marginTop: "20px" }}>
          <h3>Updated Order</h3>
          <pre>{JSON.stringify(updatedOrder, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
