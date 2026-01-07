"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  X,
  Download,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import {
  parseCSV,
  detectColumnMapping,
  importMeetResults,
  importWorkoutsFromJSON,
  validateImportFile,
  generateCSVTemplate,
  ManualImportMapping,
} from "@/lib/integrations/manual-import";
import { ImportResult } from "@/lib/integrations/types";

type ManualImportModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: (result: ImportResult) => void;
};

export function ManualImportModal({
  isOpen,
  onClose,
  onImportComplete,
}: ManualImportModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<"upload" | "mapping" | "preview" | "result">("upload");
  const [importType, setImportType] = useState<"results" | "workouts">("results");
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<"csv" | "json" | null>(null);
  const [parsedData, setParsedData] = useState<Record<string, string>[]>([]);
  const [mapping, setMapping] = useState<ManualImportMapping>({ date: "" });
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setError(null);

    const validation = await validateImportFile(selectedFile);
    if (!validation.valid) {
      setError(validation.error || "Invalid file");
      return;
    }

    setFile(selectedFile);
    setFileType(validation.type || null);

    // Read and parse file
    const text = await selectedFile.text();

    if (validation.type === "csv") {
      const data = parseCSV(text);
      if (data.length === 0) {
        setError("No data found in CSV file");
        return;
      }
      setParsedData(data);

      // Auto-detect column mapping
      const headers = Object.keys(data[0]);
      const detectedMapping = detectColumnMapping(headers);
      setMapping(detectedMapping);

      setStep("mapping");
    } else if (validation.type === "json") {
      // JSON goes directly to preview
      setParsedData([{ raw: text }]);
      setStep("preview");
    }
  };

  const handleImport = async () => {
    setImporting(true);
    setError(null);

    try {
      if (fileType === "csv" && importType === "results") {
        const { results, errors } = importMeetResults(parsedData, mapping);
        
        const importResult: ImportResult = {
          success: errors.length === 0,
          imported: results.length,
          skipped: parsedData.length - results.length,
          errors,
        };

        setResult(importResult);
        onImportComplete(importResult);
      } else if (fileType === "json") {
        const { workouts, errors } = importWorkoutsFromJSON(parsedData[0].raw);
        
        const importResult: ImportResult = {
          success: errors.length === 0,
          imported: workouts.length,
          skipped: 0,
          errors,
        };

        setResult(importResult);
        onImportComplete(importResult);
      }

      setStep("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed");
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    const template = generateCSVTemplate(importType);
    const blob = new Blob([template], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `trackverse_${importType}_template.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetModal = () => {
    setStep("upload");
    setFile(null);
    setFileType(null);
    setParsedData([]);
    setMapping({ date: "" });
    setResult(null);
    setError(null);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Upload className="w-5 h-5 text-orange-500" />
              <h2 className="font-bold text-white">Import Data</h2>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5 text-zinc-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            {/* Step: Upload */}
            {step === "upload" && (
              <div className="space-y-6">
                {/* Import Type Selection */}
                <div>
                  <label className="text-sm text-zinc-400 mb-2 block">What are you importing?</label>
                  <div className="flex gap-2">
                    {[
                      { id: "results", label: "Meet Results" },
                      { id: "workouts", label: "Workouts" },
                    ].map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setImportType(type.id as typeof importType)}
                        className={`
                          flex-1 py-3 rounded-lg font-medium transition-colors
                          ${importType === type.id
                            ? "bg-orange-500 text-white"
                            : "bg-zinc-800 text-zinc-400 hover:text-white"
                          }
                        `}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* File Upload */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-zinc-700 rounded-xl p-8 text-center cursor-pointer hover:border-orange-500/50 transition-colors"
                >
                  <FileText className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                  <p className="text-white font-medium mb-1">
                    Drop your file here or click to browse
                  </p>
                  <p className="text-zinc-500 text-sm">Supports CSV and JSON files (max 5MB)</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.json"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>

                {/* Error */}
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                  </div>
                )}

                {/* Template Download */}
                <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg">
                  <div>
                    <p className="text-white text-sm font-medium">Need a template?</p>
                    <p className="text-zinc-500 text-xs">Download a sample CSV to get started</p>
                  </div>
                  <button
                    onClick={downloadTemplate}
                    className="flex items-center gap-2 px-3 py-1.5 bg-zinc-700 text-white text-sm rounded-lg hover:bg-zinc-600 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
            )}

            {/* Step: Mapping */}
            {step === "mapping" && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-white mb-1">Map Your Columns</h3>
                  <p className="text-zinc-500 text-sm">
                    Match your CSV columns to TrackVerse fields
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    { key: "date", label: "Date", required: true },
                    { key: "event", label: "Event" },
                    { key: "time", label: "Time/Performance", required: true },
                    { key: "place", label: "Place" },
                    { key: "meetName", label: "Meet Name" },
                    { key: "notes", label: "Notes" },
                  ].map((field) => (
                    <div key={field.key} className="flex items-center gap-4">
                      <label className="w-32 text-sm text-zinc-400">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      <select
                        value={(mapping as Record<string, string>)[field.key] || ""}
                        onChange={(e) =>
                          setMapping({ ...mapping, [field.key]: e.target.value })
                        }
                        className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500"
                      >
                        <option value="">-- Select column --</option>
                        {Object.keys(parsedData[0] || {}).map((col) => (
                          <option key={col} value={col}>
                            {col}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>

                {/* Preview */}
                <div>
                  <h4 className="text-sm text-zinc-400 mb-2">Preview (first 3 rows)</h4>
                  <div className="bg-zinc-800 rounded-lg overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-zinc-700">
                          {Object.keys(parsedData[0] || {}).map((col) => (
                            <th key={col} className="px-3 py-2 text-left text-zinc-400 font-medium">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {parsedData.slice(0, 3).map((row, i) => (
                          <tr key={i} className="border-b border-zinc-700/50">
                            {Object.values(row).map((val, j) => (
                              <td key={j} className="px-3 py-2 text-zinc-300">
                                {val}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep("upload")}
                    className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleImport}
                    disabled={!mapping.date || !mapping.time || importing}
                    className="flex-1 px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {importing ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Importing...
                      </span>
                    ) : (
                      `Import ${parsedData.length} Records`
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Step: Result */}
            {step === "result" && result && (
              <div className="text-center py-8">
                {result.success ? (
                  <>
                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Import Complete!</h3>
                    <p className="text-zinc-400 mb-6">
                      Successfully imported {result.imported} records
                    </p>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-4">
                      <AlertCircle className="w-8 h-8 text-yellow-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Import Completed with Errors</h3>
                    <p className="text-zinc-400 mb-2">
                      Imported {result.imported} records, skipped {result.skipped}
                    </p>
                  </>
                )}

                {result.errors.length > 0 && (
                  <div className="mt-4 text-left bg-zinc-800 rounded-lg p-4 max-h-40 overflow-y-auto">
                    <h4 className="text-sm font-medium text-zinc-400 mb-2">Errors:</h4>
                    {result.errors.slice(0, 10).map((err, i) => (
                      <p key={i} className="text-sm text-red-400">
                        Row {err.row}: {err.message}
                      </p>
                    ))}
                    {result.errors.length > 10 && (
                      <p className="text-sm text-zinc-500 mt-2">
                        ...and {result.errors.length - 10} more errors
                      </p>
                    )}
                  </div>
                )}

                <button
                  onClick={handleClose}
                  className="mt-6 px-6 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
