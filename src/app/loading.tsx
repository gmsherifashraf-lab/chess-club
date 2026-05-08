import LoadingScreen from "@/components/brand/LoadingScreen";

/**
 * Next.js automatically renders this component while a route segment is
 * streaming. Gives every page transition a premium dark splash with
 * the club emblem instead of a blank flash.
 */
export default function Loading() {
  return <LoadingScreen />;
}
