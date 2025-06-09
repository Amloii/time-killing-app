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
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Verify Task Completion</h2>
          <p className="text-gray-600 mt-2">"{task.title}"</p>
        </div>
        
        <div className="space-y-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-3">Quick Check:</h3>
            <ul className="space-y-2">
              {verificationQuestions.map((question, index) => (
                <li key={index} className="flex items-start text-sm text-gray-700">
                  <span className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center mr-2 mt-0.5 text-xs font-bold text-blue-600">
                    {index + 1}
                  </span>
                  {question}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <button
              onClick={() => setShowNotes(!showNotes)}
              className="flex items-center text-sm text-gray-600 hover:text-gray-800"
            >
              <MessageSquare className="w-4 h-4 mr-1" />
              {showNotes ? 'Hide' : 'Add'} completion notes (optional)
            </button>
            
            {showNotes && (
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about what you accomplished..."
                className="mt-2 w-full p-3 border border-gray-300 rounded-lg resize-none"
                rows={3}
              />
            )}
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button
            onClick={() => handleVerify(true)}
            icon={<CheckCircle className="w-4 h-4" />}
            fullWidth
          >
            Yes, Completed
          </Button>
          
          <Button
            onClick={() => handleVerify(false)}
            variant="secondary"
            icon={<AlertCircle className="w-4 h-4" />}
            fullWidth
          >
            Not Quite Done
          </Button>
        </div>
        
        <div className="mt-3">
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