import ProdutoDeleteScreen from "@/features/produtos/ProdutoDeleteScreen";
import { useLocalSearchParams } from "expo-router";

export default function Delete() {
  const { id } = useLocalSearchParams();
  return <ProdutoDeleteScreen id={id} />;
}