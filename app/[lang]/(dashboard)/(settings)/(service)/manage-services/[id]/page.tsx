  "use client";
  import { useEffect, useState } from "react";
  import { Card, CardContent, CardHeader } from "@/components/ui/card";
  import { useServiceStore } from "@/store/service/useServiceStore";
  import ServiceForm from "../../_components/service-form/service-form";
  import ServiceView from "../../_components/service-view/service-view";
  const ManageService = ({ params }: { params: { id: number } }) => {
    const { mode, fetchServiceById } = useServiceStore();
    const [topic, setTopic] = useState("");

    if (mode === "edit") {
      useEffect(() => {
        setTopic("Add/Edit Service");
      }, []);
    } else {
      useEffect(() => {
        setTopic("Add Service");
      }, []);
    }

    useEffect(() => {
      fetchServiceById(params.id);
    }, []);

    return (
      <div className="h-max p-4 bg-gray-50">
        <Card className="flex flex-col h-full">
          <CardHeader className="border-none pt-5 pl-6 pr-6">
            <div className="flex items-center justify-between w-full">
              <div className="text-xl font-semibold text-default-900 whitespace-nowrap">{topic}</div>
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            {mode === "view" && <ServiceView />}
            {mode === "edit" && <ServiceForm mode={mode} />}
            {!mode && <div>No mode specified</div>}
          </CardContent>
        </Card>
      </div>
    );
  };

  export default ManageService;
