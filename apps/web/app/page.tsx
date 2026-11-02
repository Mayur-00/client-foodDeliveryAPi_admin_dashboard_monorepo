import LiveTracker from "./components/liveTracker";

const destination: [number, number] = [19.583923000793263, 78.21057956644106];
 
export default function Home() {
  return (
    <div style={{ padding: '20px' }}>
      <LiveTracker destinationCoords={destination} />
    </div>
  );
}
