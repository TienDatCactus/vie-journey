import { useParams, Navigate } from "react-router-dom";

export default function InviteRedirect() {
  const { id } = useParams();

  if (!id) return null;

  return <Navigate to={`/trips/${id}`} state={{ invite: true }} replace />;
}
