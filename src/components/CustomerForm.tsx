'use client';

import { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, Upload, X } from 'lucide-react';
import { saveCustomer } from '@/app/(app)/customers/actions';

export default function CustomerForm({ initialData = null }: { initialData?: any }) {
  const [captureMode, setCaptureMode] = useState<'none' | 'webcam'>('none');
  const [preview, setPreview] = useState<string | null>(initialData?.photoUrl || null);
  const [isWebcamPhoto, setIsWebcamPhoto] = useState(false);
  
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setPreview(imageSrc);
      setIsWebcamPhoto(true);
      setCaptureMode('none');
      // Clear file input if it had something
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [webcamRef]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setIsWebcamPhoto(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearPhoto = () => {
    setPreview(null);
    setIsWebcamPhoto(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <form 
      action={saveCustomer}
      onSubmit={(e) => {
        if (!preview) {
          e.preventDefault();
          alert("Customer photo is compulsory. Please take a photo or upload one.");
        }
      }}
       className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-3xl">
      <input type="hidden" name="id" value={initialData?.id || ''} />
      <input type="hidden" name="existingPhotoUrl" value={initialData?.photoUrl || ''} />
      
      {/* Only send base64 if it's a newly captured webcam image */}
      <input type="hidden" name="photoBase64" value={isWebcamPhoto ? preview || '' : ''} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
            <input type="text" name="name" defaultValue={initialData?.name} required className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="e.g. John Doe" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
            <input 
              type="tel" 
              name="mobile" 
              defaultValue={initialData?.mobile} 
              required 
              pattern="[0-9]{10}"
              maxLength={10}
              title="Mobile number must be exactly 10 digits (e.g. 9876543210)"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" 
              placeholder="e.g. 9876543210" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea name="address" rows={4} defaultValue={initialData?.address} required className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Full address" />
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Customer Photo</label>
          
          <input 
            type="file" 
            name="photoFile" 
            accept="image/*" 
            ref={fileInputRef}
            onChange={handleFileChange} 
            className="hidden" 
          />

          {preview ? (
            <div className="relative">
              <img src={preview} alt="Preview" className="w-full h-64 object-cover rounded-md border border-gray-200" />
              <button type="button" onClick={clearPhoto} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 shadow-md">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="h-64 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center space-y-4 bg-gray-50">
              {captureMode === 'none' && (
                <div className="flex space-x-6">
                  <button type="button" onClick={() => setCaptureMode('webcam')} className="flex flex-col items-center p-4 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                    <Camera className="w-8 h-8 mb-2" />
                    <span className="text-sm font-medium">Use Webcam</span>
                  </button>
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center p-4 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                    <Upload className="w-8 h-8 mb-2" />
                    <span className="text-sm font-medium">Upload File</span>
                  </button>
                </div>
              )}

              {captureMode === 'webcam' && (
                <div className="w-full h-full relative flex flex-col items-center bg-black rounded-md overflow-hidden">
                  <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" className="h-full w-full object-cover" />
                  <div className="absolute bottom-4 flex space-x-3">
                    <button type="button" onClick={capture} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-full shadow-lg hover:bg-blue-700">Capture Photo</button>
                    <button type="button" onClick={() => setCaptureMode('none')} className="px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-full shadow-lg hover:bg-gray-700">Cancel</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="pt-6 border-t border-gray-100 flex justify-end">
         <button type="submit" className="px-8 py-2.5 bg-[#111] text-white rounded-xl hover:bg-black font-bold shadow-lg shadow-black/10 transition-colors">
            {initialData ? 'Update Customer Details' : 'Save New Customer'}
         </button>
      </div>
    </form>
  );
}
