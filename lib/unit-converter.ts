import {useUnitStore} from "@/hooks/use-unit-store";

export default function unitConverter(value: number | null): string | null {
  const unit = useUnitStore.getState().unit; // Retrieve the current unit from the Zustand store

  // If no value is passed, return null
  if (value === null) {
    return null;
  }

  let result = value ;

  // Convert square feet to square meters if the current unit is square meters
  if (unit === 'sqm') {
    result = value * 0.092903;
  }

  // Return the result and the unit in uppercase as a string
  return result.toLocaleString() + ' ' + unit.toUpperCase();
}
