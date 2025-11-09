import React, { useEffect, useState, useRef } from "react";
import useApi from "@/hooks/useApi";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Minus, Plus, Search } from "lucide-react";
import { Activity, Heart } from "lucide-react";

export default function Stock() {
  const api = useApi();

  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [allMedicines, setAllMedicines] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const [showDropdown, setShowDropdown] = useState(false);
  const [selected, setSelected] = useState(null);

  const wrapperRef = useRef(null);

  // ADD MEDICINE MODAL
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newMed, setNewMed] = useState({ name: "", quantity: "", price: "" });

  // ===================== Fetch Medicines =====================
  useEffect(() => {
    async function fetchMedicines() {
      const { success, data } = await api.get("/pharmacy/getAllMedicines");
      if (success && data?.medicines) {
        setAllMedicines(data.medicines);
        setLoaded(true);
      }
    }
    fetchMedicines();
  }, []);

  // ===================== Search Logic =====================
  useEffect(() => {
    if (!loaded) return;

    const s = search.trim().toLowerCase();

    if (!s) {
      setFiltered(allMedicines);
      return;
    }

    const f = allMedicines.filter((m) => m.name.toLowerCase().startsWith(s));
    setFiltered(f);
  }, [search, allMedicines, loaded]);

  // ===================== Dropdown Close =====================
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ===================== Select Medicine =====================
  const handleSelect = (med) => {
    setSelected(med);
    setSearch(med.name);
    setShowDropdown(false);
  };

  // ===================== Local Update =====================
  const updateLocal = (id, delta) => {
    setAllMedicines((prev) =>
      prev.map((m) =>
        m._id === id ? { ...m, quantity: Math.max(0, m.quantity + delta) } : m
      )
    );

    setSelected((prev) =>
      prev && prev._id === id
        ? { ...prev, quantity: Math.max(0, prev.quantity + delta) }
        : prev
    );
  };

  const removeLocal = (id) => {
    setAllMedicines((prev) => prev.filter((m) => m._id !== id));
    setFiltered((prev) => prev.filter((m) => m._id !== id));

    if (selected?._id === id) setSelected(null);
  };

  // ===================== Quantity Buttons =====================
  const handleIncrement = async () => {
    const id = selected._id;
    updateLocal(id, 10);

    const res = await api.put(`/pharmacy/updateMedicine/${id}`, { delta: 10 });
    if (!res.success) updateLocal(id, -10);
  };

  const handleDecrement = async () => {
    const id = selected._id;
    if (selected.quantity <= 0) return;

    updateLocal(id, -10);

    const res = await api.put(`/pharmacy/updateMedicine/${id}`, { delta: -10 });
    if (!res.success) updateLocal(id, 10);
  };

  const handleDelete = async () => {
    const id = selected._id;
    const backup = selected;
    removeLocal(id);

    const res = await api.delete(`/pharmacy/deleteMedicine/${id}`);
    if (!res.success) {
      setAllMedicines((prev) => [...prev, backup]);
      setSelected(backup);
    }
  };

  // ===================== Add Medicine =====================
  const handleAddNewMedicine = async () => {
    const payload = {
      name: newMed.name,
      quantity: Number(newMed.quantity),
      price: Number(newMed.price),
    };

    const res = await api.post("/pharmacy/addNewMedicine", payload);

    if (res.success && res.data?.medicine) {
      setAllMedicines((prev) => [...prev, res.data.medicine]);
      setFiltered((prev) => [...prev, res.data.medicine]);

      setNewMed({ name: "", quantity: "", price: "" });
      setAddModalOpen(false);
    }
  };

  return (
    <div className="w-full min-h-screen">

      {/* ======================================================
           HERO SECTION
      ======================================================= */}
      <section className="relative w-full h-[750px] flex flex-col justify-center items-center text-center overflow-hidden">

        {/* Background image - Full display */}
        <img
          src="/hospitalforstocksbg.png"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover object-center blur-xs"
        />

        {/* Overlay for better text readability (optional) */}
        <div className="absolute inset-0 bg-white/10" />

        {/* TEXT */}
        <h1 className="relative z-10 text-4xl sm:text-5xl font-bold text-[#1f1f3a] mb-8">
          Manage Your <span className="text-purple-600">Stock</span>
        </h1>

        <p className="relative z-10 text-gray-600 text-sm sm:text-base max-w-xl mb-8 px-4">
          Search, update, and manage all your pharmacy medicines with ease.
        </p>

        {/* Search Bar */}
        <div 
          ref={wrapperRef}
          className="relative z-20 w-[90%] max-w-3xl bg-white 
                     shadow-2xl rounded-full flex items-center px-6 py-4 gap-4 mb-100"
        >
          <Search className="text-gray-400 w-5 h-5 " />

          <Input
            placeholder="Search medicine..."
            className="border-none shadow-none focus:ring-0 text-gray-700 placeholder:text-gray-400 flex-1"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => {
              setShowDropdown(true);
              if (!search.trim()) setFiltered(allMedicines);
            }}
          />

          <Button className="rounded-full bg-purple-600 hover:bg-purple-700 px-8">
            Search
          </Button>

          {/* Dropdown */}
          {showDropdown && filtered.length > 0 && (
            <Card className="absolute top-16 left-0 w-full shadow-lg border bg-white z-40 rounded-2xl">
              <ul className="divide-y max-h-64 overflow-y-auto rounded-2xl">
                {filtered.map((item) => (
                  <li
                    key={item._id}
                    className="px-4 py-3 hover:bg-purple-100 cursor-pointer flex justify-between"
                    onClick={() => handleSelect(item)}
                  >
                    <span>{item.name}</span>
                    <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* No Result */}
          {showDropdown && filtered.length === 0 && search.trim() && (
            <Card className="absolute top-16 left-0 w-full p-4 border bg-white shadow z-40 rounded-2xl">
              <p className="text-gray-500 mb-3">No medicines found</p>

              <Button
                className="bg-purple-600 text-white hover:bg-purple-700"
                onClick={() => setAddModalOpen(true)}
              >
                Add New Medicine
              </Button>
            </Card>
          )}
        </div>
      </section>

      {/* ======================================================
           SELECTED MEDICINE CARD
      ======================================================= */}
      {selected && (
  <div className="flex justify-center w-full px-4 mt-10">

    <Card
      className="w-full max-w-2xl shadow-2xl border-none p-6 relative overflow-hidden
                 transition-all hover:shadow-[0_10px_40px_rgba(80,0,150,0.25)]
                 rounded-2xl backdrop-blur-xl"
      style={{
        background: "rgba(255, 255, 255, 0.7)",
      }}
    >
      {/* Decorative Background Icons */}
      <Heart
        className="absolute -top-6 -right-6 w-24 h-24 opacity-[0.06]"
        color="#9b6bff"
        fill="#9b6bff"
      />

      <Activity
        className="absolute bottom-0 left-0 w-28 h-28 opacity-[0.05]"
        color="#7c3aed"
      />

      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-purple-700 flex items-center justify-center gap-3">
          <Search className="w-7 h-7 text-purple-500" />
          Selected Medicine
        </h2>
        <p className="text-gray-600">{selected.name}</p>
      </div>

      {/* Medicine Details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">

        <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-white hover:scale-105 transition cursor-default">
          <span className="text-sm text-gray-600 font-medium">Quantity</span>
          <div className="text-3xl font-bold text-purple-700 mt-1">
            {selected.quantity}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-white hover:scale-105 transition cursor-default">
          <span className="text-sm text-gray-600 font-medium">Price</span>
          <div className="text-3xl font-bold text-purple-700 mt-1">
            ₹{selected.price}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-white hover:scale-105 transition cursor-default">
          <span className="text-sm text-gray-600 font-medium">Total Value</span>
          <div className="text-3xl font-bold text-purple-700 mt-1">
            ₹{selected.quantity * selected.price}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-4 mt-8">

        <Button
          variant="outline"
          size="icon"
          onClick={handleDecrement}
          className="border-purple-500 text-purple-600 hover:bg-purple-50 hover:text-purple-700 transition-all"
        >
          <Minus className="h-5 w-5" />
        </Button>

        <Button
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-12 py-5 shadow-lg hover:scale-105 transition-all"
          onClick={handleIncrement}
        >
          Add 10
        </Button>

        <Button
          variant="destructive"
          size="icon"
          onClick={handleDelete}
          className="hover:scale-105 transition-all"
        >
          <Trash2 className="h-5 w-5" />
        </Button>

      </div>
    </Card>
  </div>
)}


      {/* ======================================================
           ADD NEW MEDICINE MODAL
      ======================================================= */}
      {addModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <Card className="p-6 w-[350px] bg-white shadow-2xl border rounded-xl">
            <h2 className="text-xl font-bold mb-4">Add New Medicine</h2>

            <div className="space-y-4 mb-4">
              <Input
                placeholder="Medicine Name"
                value={newMed.name}
                onChange={(e) =>
                  setNewMed({ ...newMed, name: e.target.value })
                }
              />

              <Input
                placeholder="Quantity"
                type="number"
                value={newMed.quantity}
                onChange={(e) =>
                  setNewMed({ ...newMed, quantity: e.target.value })
                }
              />

              <Input
                placeholder="Price"
                type="number"
                value={newMed.price}
                onChange={(e) =>
                  setNewMed({ ...newMed, price: e.target.value })
                }
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setAddModalOpen(false)}>
                Cancel
              </Button>

              <Button
                className="bg-purple-600 text-white hover:bg-purple-700"
                onClick={handleAddNewMedicine}
              >
                Save
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}