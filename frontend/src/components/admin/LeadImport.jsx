import { useRef, useState } from "react";
import {
  ArrowLeft,
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  X,
  Loader2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import leadService from "../../services/leadService";

const ACCEPTED_EXTENSIONS = [".xlsx", ".xls", ".csv"];

function isAcceptedFile(file) {
  if (!file) return false;
  const name = file.name.toLowerCase();
  return ACCEPTED_EXTENSIONS.some((ext) => name.endsWith(ext));
}

function LeadImport() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChosen = (chosenFile) => {
    if (!chosenFile) return;

    if (!isAcceptedFile(chosenFile)) {
      toast.error("Please choose a .xlsx, .xls or .csv file.");
      return;
    }

    setFile(chosenFile);
    setResult(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChosen(e.dataTransfer.files?.[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please choose a file first.");
      return;
    }

    try {
      setUploading(true);
      const response = await leadService.bulkImportLeads(file);
      setResult(response);

      if (response.importedCount > 0) {
        toast.success(`Imported ${response.importedCount} lead(s) successfully`);
      } else {
        toast("No new leads were imported — see details below.", { icon: "⚠️" });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to import the spreadsheet"
      );
    } finally {
      setUploading(false);
    }
  };

  const resetImport = () => {
    setFile(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-6">
      <Link
        to="/admin/leads"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
      >
        <ArrowLeft size={17} />
        Back to Leads
      </Link>

      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Import Leads</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Upload an Excel or CSV sheet of leads and add them all to your CRM at once.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {!result && (
          <>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-10 text-center transition ${
                isDragging
                  ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10"
                  : "border-slate-300 hover:border-indigo-400 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                onChange={(e) => handleFileChosen(e.target.files?.[0])}
              />

              {file ? (
                <>
                  <FileSpreadsheet size={38} className="text-indigo-600" />
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-200">{file.name}</p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {(file.size / 1024).toFixed(1)} KB — click to choose a different file
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <UploadCloud size={38} className="text-slate-400" />
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-200">
                      Drag & drop your spreadsheet here
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      or click to browse — accepts .xlsx, .xls or .csv
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              {file && (
                <button
                  type="button"
                  onClick={resetImport}
                  disabled={uploading}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  Clear
                </button>
              )}

              <button
                type="button"
                onClick={handleUpload}
                disabled={!file || uploading}
                className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {uploading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <UploadCloud size={16} />
                    Import Leads
                  </>
                )}
              </button>
            </div>

            <div className="mt-8 rounded-xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-800/50 dark:text-slate-400">
              <p className="font-semibold text-slate-700 dark:text-slate-300">Tips for a clean import</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Use the first row of the sheet for column headers (e.g. name, phone, website, email, google_rating...).</li>
                <li>A row needs at least a name to be imported.</li>
                <li>Rows with an email or phone that already exists in your CRM are automatically skipped.</li>
                <li>Extra columns from your sheet that aren't recognized are simply ignored.</li>
              </ul>
            </div>
          </>
        )}

        {result && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Rows in file
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{result.totalRows}</p>
              </div>

              <div className="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-500/20 dark:bg-green-500/10">
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-green-700 dark:text-green-400">
                  <CheckCircle2 size={14} />
                  Imported
                </div>
                <p className="mt-2 text-2xl font-bold text-green-700 dark:text-green-400">{result.importedCount}</p>
              </div>

              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/20 dark:bg-amber-500/10">
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-amber-700 dark:text-amber-400">
                  <AlertTriangle size={14} />
                  Skipped
                </div>
                <p className="mt-2 text-2xl font-bold text-amber-700 dark:text-amber-400">{result.skippedCount}</p>
              </div>
            </div>

            {result.errors?.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Skipped rows
                </p>
                <div className="max-h-64 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left text-sm">
                    <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800/60">
                      <tr>
                        <th className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Row</th>
                        <th className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Reason</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.errors.map((err, i) => (
                        <tr key={i} className="border-t border-slate-100 dark:border-slate-800">
                          <td className="px-4 py-2 text-slate-500">#{err.row}</td>
                          <td className="px-4 py-2 text-slate-700 dark:text-slate-300">{err.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 dark:border-slate-800 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={resetImport}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                <X size={16} />
                Import Another File
              </button>

              <button
                type="button"
                onClick={() => navigate("/admin/leads")}
                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Go to Leads
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LeadImport;
