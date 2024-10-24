import Image from "next/image";

interface Step {
  label: string;
  icon?: string; 
}

interface StepsBarProps {
  steps: Step[];
  currentStep: number;
  sendImageUrl: string;
  receiveImageUrl: string;
}

const StepsBar: React.FC<StepsBarProps> = ({
  steps,
  currentStep,
  sendImageUrl,
  receiveImageUrl
}) => {
  return (
    <div className="hidden md:flex items-center space-x-4 text-xs mb-6">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
        
          <div className="flex items-center">
            {index !== 0 && (
              <span className="text-gray-500 mx-2">{">"}</span> 
            )}
            <span
              className={`font-bold mr-1 ${
                index === currentStep ? "text-white" : "text-gray-500"
              }`}
            >
              STEP {index + 1}:{" "}
            </span>
            
            
            {index === 1 && (
              <Image
                src={sendImageUrl} 
                alt="Send Icon"
                width={20}
                height={20}
                className="inline mr-2"
              />
            )}
            {index === 2 && (
              <Image
                src={receiveImageUrl} 
                alt="Receive Icon"
                width={20}
                height={20}
                className="inline mr-2"
              />
            )}

            <span
              className={`uppercase ${
                index === currentStep ? "text-white" : "text-gray-500"
              }`}
            >
              {step.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StepsBar;
