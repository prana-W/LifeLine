import React, { useEffect, useState, useRef } from "react";
import useApi from "@/hooks/useApi";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Minus, Plus } from "lucide-react";
import MedicineCard from "@/components/general/MedicinCard.jsx";

export default function Stock() {
  const api = useApi();

  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [allMedicines, setAllMedicines] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const [showDropdown, setShowDropdown] = useState(false);
  const [selected, setSelected] = useState(null);

  const wrapperRef = useRef(null);

  // ADD NEW MEDICINE MODAL
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newMed, setNewMed] = useState({
    name: "",
    quantity: "",
    price: ""
  });

  // Load all medicines once
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

  // Search logic
  useEffect(() => {
    if (!loaded) return;

    const s = search.trim().toLowerCase();

    if (!s) {
      setFiltered(allMedicines); // show all only on focus
      return;
    }

    const f = allMedicines.filter((m) =>
      m.name.toLowerCase().startsWith(s)
    );

    setFiltered(f);
  }, [search, allMedicines, loaded]);

  // Click outside closes dropdown
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (med) => {
    setSelected(med);
    setSearch(med.name);
    setShowDropdown(false);
  };

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

  const handleIncrement = async () => {
    const id = selected._id;
    updateLocal(id, 10);

    const res = await api.put(`/pharmacy/updateMedicine/${id}`, {
      delta: 10,
    });

    if (!res.success) updateLocal(id, -10);
  };

  const handleDecrement = async () => {
    const id = selected._id;
    if (selected.quantity <= 0) return;

    updateLocal(id, -10);

    const res = await api.put(`/pharmacy/updateMedicine/${id}`, {
      delta: -10,
    });

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

  // ✅ Add new medicine submit logic
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
    <div className="w-full flex flex-col items-center gap-6 mt-10">
      <div className="w-full max-w-xl relative" ref={wrapperRef}>
        <Input
          placeholder="Search medicine..."
          className="py-6 px-4 border-gray-300"
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

        {/* Dropdown */}
        {showDropdown && filtered.length > 0 && (
          <Card className="absolute top-16 left-0 w-full shadow-lg border bg-white z-20">
            <ul className="divide-y max-h-64 overflow-y-auto">
              {filtered.map((item) => (
                <li
                  key={item._id}
                  className="px-4 py-3 hover:bg-purple-100 cursor-pointer flex justify-between"
                  onClick={() => handleSelect(item)}
                >
                  <span>{item.name}</span>
                  <span className="text-sm text-gray-500">
                    Qty: {item.quantity}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* ✅ No Search Results + Add New Medicine */}
        {showDropdown && filtered.length === 0 && (
          <Card className="absolute top-16 left-0 w-full p-4 border bg-white shadow z-20">
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

      {/* Selected Medicine Card */}
      {selected && (
        <div className="flex flex-col items-center mt-5 gap-4">
          <MedicineCard
            name={selected.name}
            quantity={selected.quantity}
            price={selected.price}
          />

          {/* buttons */}
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={handleDecrement}>
              <Minus className="h-4 w-4" />
            </Button>

            <Button variant="outline" size="icon" onClick={handleIncrement}>
              <Plus className="h-4 w-4" />
            </Button>

            <Button variant="destructive" size="icon" onClick={handleDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* ✅ ADD NEW MEDICINE MODAL */}
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
