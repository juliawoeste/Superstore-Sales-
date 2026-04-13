import { useState } from "react";

export default function CreateOrder() {
  const [formData, setFormData] = useState({
    Row_ID: "",
    Order_ID: "",
    Order_Date: "",
    Ship_Date: "",
    Ship_Mode: "",
    Customer_ID: "",
    Customer_Name: "",
    Segment: "",
    Country: "",
    City: "",
    State: "",
    Postal_Code: "",
    Region: "",
    Product_ID: "",
    Category: "",
    Sub_Category: "",
    Product_Name: "",
    Sales: "",
  });

  const [message, setMessage] = useState("");
  const [createdOrder, setCreatedOrder] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setCreatedOrder(null);

    try {
      const response = await fetch("http://localhost:5001/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create order");
      }

      setMessage("Order created successfully.");
      setCreatedOrder(data);

      setFormData({
        Row_ID: "",
        Order_ID: "",
        Order_Date: "",
        Ship_Date: "",
        Ship_Mode: "",
        Customer_ID: "",
        Customer_Name: "",
        Segment: "",
        Country: "",
        City: "",
        State: "",
        Postal_Code: "",
        Region: "",
        Product_ID: "",
        Category: "",
        Sub_Category: "",
        Product_Name: "",
        Sales: "",
      });
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create Order</h2>

      <form
        onSubmit={handleSubmit}
        style={{ display: "grid", gap: "10px", maxWidth: "500px" }}
      >
        <input
          name="Row_ID"
          placeholder="Row_ID"
          value={formData.Row_ID}
          onChange={handleChange}
        />
        <input
          name="Order_ID"
          placeholder="Order_ID"
          value={formData.Order_ID}
          onChange={handleChange}
          required
        />
        <input
          name="Order_Date"
          placeholder="Order_Date"
          value={formData.Order_Date}
          onChange={handleChange}
        />
        <input
          name="Ship_Date"
          placeholder="Ship_Date"
          value={formData.Ship_Date}
          onChange={handleChange}
        />
        <input
          name="Ship_Mode"
          placeholder="Ship_Mode"
          value={formData.Ship_Mode}
          onChange={handleChange}
        />
        <input
          name="Customer_ID"
          placeholder="Customer_ID"
          value={formData.Customer_ID}
          onChange={handleChange}
        />
        <input
          name="Customer_Name"
          placeholder="Customer_Name"
          value={formData.Customer_Name}
          onChange={handleChange}
        />
        <input
          name="Segment"
          placeholder="Segment"
          value={formData.Segment}
          onChange={handleChange}
        />
        <input
          name="Country"
          placeholder="Country"
          value={formData.Country}
          onChange={handleChange}
        />
        <input
          name="City"
          placeholder="City"
          value={formData.City}
          onChange={handleChange}
        />
        <input
          name="State"
          placeholder="State"
          value={formData.State}
          onChange={handleChange}
        />
        <input
          name="Postal_Code"
          placeholder="Postal_Code"
          value={formData.Postal_Code}
          onChange={handleChange}
        />
        <input
          name="Region"
          placeholder="Region"
          value={formData.Region}
          onChange={handleChange}
        />
        <input
          name="Product_ID"
          placeholder="Product_ID"
          value={formData.Product_ID}
          onChange={handleChange}
        />
        <input
          name="Category"
          placeholder="Category"
          value={formData.Category}
          onChange={handleChange}
        />
        <input
          name="Sub_Category"
          placeholder="Sub_Category"
          value={formData.Sub_Category}
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

        <button type="submit">Create Order</button>
      </form>

      {message && <p>{message}</p>}

      {createdOrder && (
        <div style={{ marginTop: "20px" }}>
          <h3>Created Order</h3>
          <pre>{JSON.stringify(createdOrder, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
