
import Select from "react-select";
const furits: { value: string, label: string }[] = [
  { value: "A", label: "Active" },
  { value: "I", label: "Inactive" },
];
const responsiveStyles = {
  container: (provided) => ({
    ...provided,
    width: '100%',
    maxWidth: '500px',
    minWidth: '200px',
  }),
  control: (provided) => ({
    ...provided,
    width: '100%',
  }),
};


const BasicSelectComplete = () => {
  return (
    <div className="">
        <Select
          className="react-select"
          classNamePrefix="select"
          // defaultValue={furits[0]}
          options={furits}
          // styles={responsiveStyles}
        />
    </div>
  );
};

export default BasicSelectComplete;