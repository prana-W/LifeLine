import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  Minus,
  Plus,
  Search,
  Package,
  AlertTriangle,
  Clock,
  DollarSign,
  X
} from "lucide-react";
import useApi from "@/hooks/useApi.js";

export default function Stock() {

    const api = useApi();

  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [allMedicines, setAllMedicines] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selected, setSelected] = useState(null);
  const [slideDirection, setSlideDirection] = useState(0);
  const wrapperRef = useRef(null);

    // ===================== ADD MEDICINE MODAL =====================
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [newMed, setNewMed] = useState({ name: "", quantity: "", price: "" });

// ===================== FETCH MEDICINES =====================
    useEffect(() => {
        async function fetchMedicines() {
            const { success, data } = await api.get("/pharmacy/getAllMedicines");
            if (success && data?.medicines) {
                setAllMedicines(data.medicines);
                setFiltered(data.medicines);
                setLoaded(true);
            }
        }

        fetchMedicines();
    }, []);

// ===================== SEARCH LOGIC =====================
    useEffect(() => {
        if (!loaded) return;

        const s = search.trim().toLowerCase();
        if (!s) return setFiltered(allMedicines);

        const f = allMedicines.filter((m) => m.name.toLowerCase().startsWith(s));
        setFiltered(f);
    }, [search, allMedicines, loaded]);

// ===================== DROPDOWN CLOSE =====================
    useEffect(() => {
        function handleClickOutside(e) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

// ===================== SELECT MEDICINE =====================
    const handleSelect = (med) => {
        const currentIndex = allMedicines.findIndex((m) => m._id === selected?._id);
        const newIndex = allMedicines.findIndex((m) => m._id === med._id);
        setSlideDirection(newIndex > currentIndex ? 1 : -1);
        setSelected(med);
        setSearch(med.name);
        setShowDropdown(false);
    };

// ===================== LOCAL UPDATE HELPERS =====================
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

// ===================== UPDATE QUANTITY =====================
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

// ===================== DELETE MEDICINE =====================
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

// ===================== ADD NEW MEDICINE =====================
    const handleAddNewMedicine = async () => {
        if (!newMed.name.trim()) return;

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

    const getSideCards = () => {
    if (!selected) return { left: null, right: null };
    const idx = allMedicines.findIndex((m) => m._id === selected._id);
    return {
      left: allMedicines[(idx - 1 + allMedicines.length) % allMedicines.length],
      right: allMedicines[(idx + 1) % allMedicines.length],
    };
  };

  const lowStockItems = allMedicines.filter(
    (m) => m.quantity > 0 && m.quantity < 50
  );
  const totalValue = allMedicines.reduce(
    (acc, m) => acc + m.quantity * m.price,
    0
  );

  return (
    <div
      className="
        w-full min-h-screen 
        bg-[radial-gradient(circle,_#b38bfa_1px,_transparent_1px)]
        bg-[length:18px_18px]
        bg-purple-50/30
      "
    >
      <section className="relative w-full min-h-screen flex flex-col items-center pt-24 pb-16">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-purple-100 px-6 py-2 rounded-full mb-4 shadow-md">
            <Package className="h-5 w-5 text-purple-700" />
            <span className="text-purple-700 font-semibold">
              Inventory Dashboard
            </span>
          </div>

          <h1 className="text-6xl font-bold text-[#1f1f3a]">
            Manage Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
              Stock
            </span>
          </h1>
        </motion.div>

        {/* SEARCH BAR */}
        <div className="w-full px-4">
          <div
            ref={wrapperRef}
            className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl px-6 py-5 flex items-center gap-4 border border-purple-100 relative"
          >
            <Search className="text-purple-500 w-6 h-6" />

            <Input
              placeholder="Search medicine..."
              className="border-none flex-1 text-lg focus-visible:ring-0"
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

            {/* SEARCH BUTTON */}
            <Button className="rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-6 text-white">
              Search
            </Button>

            {/* ADD NEW MEDICINE BUTTON */}
            <Button
              onClick={() => setAddModalOpen(true)}
              className="rounded-full bg-purple-500 hover:bg-purple-600 text-white px-6 shadow-md"
            >
              + Add
            </Button>

            {/* DROPDOWN */}
            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-20 left-0 w-full z-40"
                >
                  <Card className="bg-white rounded-xl shadow-xl border border-purple-100">
                    <ul className="max-h-72 overflow-y-auto">
                      {filtered.map((item) => (
                        <li
                          key={item._id}
                          className="px-6 py-4 hover:bg-purple-50 cursor-pointer flex justify-between"
                          onClick={() => handleSelect(item)}
                        >
                          <span>{item.name}</span>
                          <span
                            className={
                              item.quantity === 0
                                ? "text-red-600"
                                : item.quantity < 50
                                ? "text-orange-600"
                                : "text-green-600"
                            }
                          >
                            Qty: {item.quantity}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* SELECTED MEDICINE + SIDE CARDS */}
        <AnimatePresence mode="wait">
          {selected && (
            <motion.div
              key="selectedMed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-12 w-full flex justify-center"
            >
              <div className="flex gap-8 items-end">
                {(() => {
                  const { left, right } = getSideCards();

                  return (
                    <>
                      {/* LEFT CARD */}
                      {left && (
                        <Card
                          onClick={() => handleSelect(left)}
                          className="w-64 p-5 bg-white/90 border rounded-2xl shadow-xl cursor-pointer hover:scale-105 transition-all"
                        >
                          <p className="font-semibold text-purple-700">
                            {left.name}
                          </p>
                          <p className="text-gray-600 text-sm">
                            Qty: {left.quantity}
                          </p>
                        </Card>
                      )}

                      {/* CENTER CARD */}
                      <motion.div
                        key={selected._id}
                        initial={{ y: slideDirection * 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: slideDirection * -100, opacity: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 150,
                          damping: 20,
                        }}
                      >
                        <Card className="w-[450px] p-8 bg-gradient-to-br from-white to-purple-50 rounded-3xl shadow-2xl border-2 border-purple-200">
                          <h2 className="text-3xl font-bold text-purple-700">
                            {selected.name}
                          </h2>

                          <div className="grid grid-cols-3 gap-3 mt-6">
                            <div className="bg-white p-4 rounded-xl shadow">
                              <p className="text-xl font-bold text-purple-700">
                                {selected.quantity}
                              </p>
                              <p className="text-gray-500 text-xs">Qty</p>
                            </div>

                            <div className="bg-white p-4 rounded-xl shadow">
                              <p className="text-xl font-bold text-blue-700">
                                ₹{selected.price}
                              </p>
                              <p className="text-gray-500 text-xs">Price</p>
                            </div>

                            <div className="bg-white p-4 rounded-xl shadow">
                              <p className="text-xl font-bold text-green-700">
                                ₹{selected.quantity * selected.price}
                              </p>
                              <p className="text-gray-500 text-xs">Value</p>
                            </div>
                          </div>

                          <div className="flex justify-center gap-4 mt-6">
                            <Button
                              variant="outline"
                              onClick={handleDecrement}
                            >
                              <Minus className="w-4 h-4 mr-1" /> Remove 10
                            </Button>

                            <Button
                              className="bg-purple-600 text-white"
                              onClick={handleIncrement}
                            >
                              <Plus className="w-4 h-4 mr-1" /> Add 10
                            </Button>

                            <Button
                              variant="destructive"
                              onClick={handleDelete}
                            >
                              <Trash2 />
                            </Button>
                          </div>
                        </Card>
                      </motion.div>

                      {/* RIGHT CARD */}
                      {right && (
                        <Card
                          onClick={() => handleSelect(right)}
                          className="w-64 p-5 bg-white/90 rounded-2xl shadow-xl cursor-pointer hover:scale-105 transition-all"
                        >
                          <p className="font-semibold text-purple-700">
                            {right.name}
                          </p>
                          <p className="text-gray-600 text-sm">
                            Qty: {right.quantity}
                          </p>
                        </Card>
                      )}
                    </>
                  );
                })()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ADD MEDICINE MODAL */}
      {addModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="p-8 bg-white rounded-2xl max-w-md w-full relative shadow-xl border border-purple-200">
            <Button
              variant="ghost"
              className="absolute top-4 right-4"
              onClick={() => setAddModalOpen(false)}
            >
              <X />
            </Button>

            <h2 className="text-2xl font-bold text-purple-700 mb-6">
              Add New Medicine
            </h2>

            <Input
              placeholder="Medicine Name"
              className="mb-3"
              value={newMed.name}
              onChange={(e) =>
                setNewMed({ ...newMed, name: e.target.value })
              }
            />

            <Input
              placeholder="Quantity"
              type="number"
              className="mb-3"
              value={newMed.quantity}
              onChange={(e) =>
                setNewMed({ ...newMed, quantity: e.target.value })
              }
            />

            <Input
              placeholder="Price"
              type="number"
              className="mb-5"
              value={newMed.price}
              onChange={(e) =>
                setNewMed({ ...newMed, price: e.target.value })
              }
            />

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setAddModalOpen(false)}
              >
                Cancel
              </Button>

              <Button
                className="bg-purple-600 text-white"
                onClick={handleAddNewMedicine}
              >
                Add
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
