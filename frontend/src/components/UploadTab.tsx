interface UploadTabProps {
  uploadProgress: number
  uploadStatus: string
  isUploading: boolean
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function UploadTab({
  uploadProgress,
  uploadStatus,
  isUploading,
  onFileUpload,
}: UploadTabProps) {
  return (
    <div className="text-center p-12 bg-[rgba(100,108,255,0.05)] rounded-xl border-2 border-dashed border-[#646cff]">
      <h2 className="text-3xl mb-4">Upload Product CSV</h2>
      <div className="my-8">
        <input
          type="file"
          id="file-upload"
          accept=".csv"
          onChange={onFileUpload}
          disabled={isUploading}
          className="hidden"
        />
        <label
          htmlFor="file-upload"
          className={`inline-block px-8 py-4 rounded-lg cursor-pointer text-xl transition-colors duration-300 ${
            isUploading
              ? 'bg-[#646cff] text-white opacity-60 cursor-not-allowed'
              : 'bg-[#646cff] text-white hover:bg-[#535bf2]'
          }`}
        >
          {isUploading ? 'Uploading...' : 'Choose CSV File'}
        </label>
        {isUploading && (
          <div className="mt-8 max-w-[500px] mx-auto">
            <div className="w-full h-8 bg-[#1a1a1a] rounded-[15px] overflow-hidden mb-4">
              <div
                className="h-full bg-[#646cff] transition-all duration-300 ease-in-out rounded-[15px]"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-xl font-bold my-2">{uploadProgress}%</p>
            <p className="text-gray-500 my-2">{uploadStatus}</p>
          </div>
        )}
        {uploadStatus && !isUploading && (
          <p className="mt-4 p-4 rounded-lg bg-[rgba(76,175,80,0.2)] text-[#4caf50] border border-[#4caf50]">
            {uploadStatus}
          </p>
        )}
      </div>
      <p className="mt-4 text-gray-500 text-sm">
        Upload a CSV file with up to 500,000 products. Duplicate SKUs will be overwritten.
      </p>
    </div>
  )
}

