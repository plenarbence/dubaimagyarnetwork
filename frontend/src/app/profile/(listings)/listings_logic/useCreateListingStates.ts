"use client";

import { useState } from "react";

export function useCreateListingStates() {

  // ---- TITLE ----
  const [title, setTitle] = useState("");

  // ---- TAGS ----
  const [tags, setTags] = useState<string[]>([]);

  // ---- DESCRIPTION ----
  const [description, setDescription] = useState("");

  // ---- CONTACT FIELDS ----
  const [contact, setContact] = useState({
    company: "",
    phone: "",
    email: "",
    website: "",
    location: "",
    whatsapp: "",
    instagram: "",
    tiktok: "",
    facebook: "",
    youtube: "",
  });

  // ---- CATEGORY (PARENT/CHILD) ----
  const [category, setCategory] = useState({
    parentId: "",
    childId: "",
  });



  
  return {
    title, setTitle,
    tags, setTags,
    description, setDescription,
    contact, setContact,
    category, setCategory,
  };
}
