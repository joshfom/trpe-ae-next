import { cn } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type Props = {
    columnIndex: number;
    selectedColumns: Record<string, string | null>;
    onChange: (
        columnIndex: number,
        value: string | null
    ) => void;
};

const options = [
    {label: "Name", value: "name"},
    {label: "Building Name", value: "building_name"},
    {label: "Phone", value: "phone"},
    {label: "Mobile", value: "mobile"},
    {label: "Building No.", value: "building_no"},
    {label: "Size", value: "size"},
    {label: "Unit Number", value: "unit_number"},
    {label: "Procedure Number", value: "procedure_number"},
    {label: "Resident Country", value: "resident"},
    {label: "Nationality", value: "nationality"},
    {label: "Address", value: "address"},
    {label: "Plot Number", value: "plot_number"},
    {label: "Email", value: "email"},
    {label: "Room Type", value: "room_type"},
    {label: "Area Owned", value: "area_owned"},
    {label: "Total Area", value: "total_area"},
    {label: "Usage Type", value: "usage_type"},
    {label: "Project", value: "project"},
    {label: "Master Project", value: "master_project"},
    {label: "Municipality Number", value: "municipality_number"},
];

export const TableHeadSelect = ({
                                    columnIndex,
                                    selectedColumns,
                                    onChange,
                                }: Props) => {
    const currentSelection = selectedColumns[`column_${columnIndex}`];

    return (
        <Select
            value={currentSelection || ""}
            onValueChange={(value) => onChange(columnIndex, value)}
        >
            <SelectTrigger
                className={cn(
                    "focus:ring-offset-0 focus:ring-transparent outline-hidden border-none bg-transparent capitalize",
                    currentSelection && "text-blue-500",
                )}
            >
                <SelectValue placeholder="Skip" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="skip">Skip</SelectItem>
                {options.map((option, index) => {
                    const disabled =
                        Object.values(selectedColumns).includes(option?.value)
                        && selectedColumns[`column_${columnIndex}`] !== option?.value;

                    return (
                        <SelectItem
                            key={index}
                            value={option?.value}
                            disabled={disabled}
                            className="capitalize"
                            title={option?.value}
                        >
                            {option.label}
                        </SelectItem>
                    )
                })}
            </SelectContent>
        </Select>
    );
};
