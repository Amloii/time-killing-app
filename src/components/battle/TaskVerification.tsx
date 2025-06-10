import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, MessageSquare } from 'lucide-react';
import { Task } from '../../types';
import Button from '../common/Button';

interface TaskVerificationProps {
  task: Task;
  onVerify: (taskId: string, verified: boolean, notes?: string) => void;
  onCancel: () => void;
}

const TaskVerification: React.FC<TaskVerificationProps> = ({
  task,
  onVerify,
  onCancel
}) => {
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  
  const verificationQuestions = [
    "Did you complete all the main objectives of this task?",
    "Are you satisfied with the quality of work done?",
    "Would you consider this task fully finished?",
  ];
  
  const handleVerify = (verified: boolean) => {
    onVerify(task.id, verified, notes.trim() || undefined);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-4 sm:mb-6">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 px-2">Verify Task Completion</h2>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base px-2 break-words">"{task.title}"</p>
        </div>
        
        <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Quick Check:</h3>
            <ul className="space-y-2 sm:space-y-3">
              {verificationQuestions.map((question, index) => (
                <li key={index} className="flex items-start text-xs sm:text-sm text-gray-700">
                  <span className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center mr-2 sm:mr-3 mt-0.5 text-xs font-bold text-blue-600 flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="leading-relaxed">{question}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <button
              onClick={() => setShowNotes(!showNotes)}
              className="flex items-center text-xs sm:text-sm text-gray-600 hover:text-gray-800 p-2 -m-2 rounded-md hover:bg-gray-50 transition-colors"
            >
              <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              {showNotes ? 'Hide' : 'Add'} completion notes (optional)
            </button>
            
            {showNotes && (
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about what you accomplished..."
                className="mt-2 w-full p-2 sm:p-3 border border-gray-300 rounded-lg resize-none text-sm sm:text-base"
                rows={2}
              />
            )}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button
            onClick={() => handleVerify(true)}
            icon={<CheckCircle className="w-4 h-4" />}
            fullWidth
            size="md"
          >
            Yes, Completed
          </Button>
          
          <Button
            onClick={() => handleVerify(false)}
            variant="secondary"
            icon={<AlertCircle className="w-4 h-4" />}
            fullWidth
            size="md"
          >
            Not Quite Done
          </Button>
        </div>
        
        <div className="mt-2 sm:mt-3">
          <Button
            onClick={onCancel}
            variant="secondary"
            fullWidth
            size="sm"
          >
            Continue Working
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskVerification;