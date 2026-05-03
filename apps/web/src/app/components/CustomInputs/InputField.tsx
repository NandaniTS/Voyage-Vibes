"use client";

import { Input } from "@heroui/react";
import React from "react";
import { Controller } from "react-hook-form";

type props = {
  name: string;
  label: string;
  placeholder: string;
  control: any;
};

const InputField = ({ name, label, placeholder, control }: props) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Input
          {...field}
          label={label}
          placeholder={placeholder}
        />
      )}
    />
  );
};

export default InputField;
