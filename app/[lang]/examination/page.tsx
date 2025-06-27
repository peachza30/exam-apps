"use client";
import Image from "next/image";
import ExaminationForm from "./exam-form";
import auth3Light from "@/public/images/auth/auth3-light.png";
import auth3Dark from "@/public/images/auth/auth3-dark.png";
import { Card, CardContent } from "@/components/ui/card";
const LoginPage = () => {
  return (
    <Card className="w-full max-w-xl mx-auto mt-10 bg-white dark:bg-gray-800 shadow-lg h-[90vh] overflow-y-auto">
  <ExaminationForm />
</Card>

  );
};

export default LoginPage;
