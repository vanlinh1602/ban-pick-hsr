import { motion } from 'framer-motion';
type Props = {
  state: 'idle' | 'selecting' | 'banning';
  info: {
    name: string;
    image: string;
    id: string;
  };
};

export default function BanPickCard({ state, info }: Props) {
  return (
    <motion.div
      animate={state}
      variants={{
        idle: { boxShadow: '0 0 0 0px rgba(59, 130, 246, 0)' },
        selecting: { boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.5)' },
        banning: { boxShadow: '0 0 0 4px rgba(239, 68, 68, 0.5)' },
      }}
      transition={{
        duration: 0.5,
        repeat: state !== 'idle' ? Infinity : 0,
        repeatType: 'reverse',
      }}
    >
      <div
        className={`flex flex-col items-center justify-center ${info.image ? 'bg-gray-100' : 'bg-gray-400'}`}
      >
        <div className="relative">
          {info.image ? (
            <img
              src={info.image}
              alt={info.name}
              className="w-full h-29 bg-cover rounded"
            />
          ) : (
            <div className="w-full h-24 object-cover rounded" />
          )}
          <div className="absolute inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <span className="text-white text-xs font-bold">{info.name}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
