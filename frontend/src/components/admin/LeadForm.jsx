import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import leadService from "../../services/leadService";

function LeadForm({ lead, onSuccess, onCancel }) {
  const isEditing = Boolean(lead);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      source: "Website",
      message: "",
    },
  });

  useEffect(() => {
    if (lead) {
      reset({
        name: lead.name || "",
        email: lead.email || "",
        phone: lead.phone || "",
        company: lead.company || "",
        source: lead.source || "Website",
        message: lead.message || "",
      });
    }
  }, [lead, reset]);

  const onSubmit = async (data) => {
    try {
      if (isEditing) {
        await leadService.updateLead(lead._id, data);
        toast.success("Lead updated successfully");
      } else {
        await leadService.createLead(data);
        toast.success("Lead created successfully");
      }

      onSuccess();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

  const inputClass = `
    w-full rounded-xl border
    border-slate-200 bg-slate-50
    px-4 py-3 text-sm
    outline-none transition
    focus:border-indigo-500
    focus:ring-2 focus:ring-indigo-500/20
    dark:border-slate-700
    dark:bg-slate-800
  `;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Name *
          </label>

          <input
            {...register("name", {
              required: "Name is required",
            })}
            placeholder="Rahul Sharma"
            className={inputClass}
          />

          {errors.name && (
            <p className="mt-1 text-xs text-red-500">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Email *
          </label>

          <input
            type="email"
            {...register("email", {
              required: "Email is required",
            })}
            placeholder="rahul@example.com"
            className={inputClass}
          />

          {errors.email && (
            <p className="mt-1 text-xs text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Phone
          </label>

          <input
            {...register("phone")}
            placeholder="+91 9876543210"
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Company
          </label>

          <input
            {...register("company")}
            placeholder="ABC Solutions"
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Source
          </label>

          <select
            {...register("source")}
            className={inputClass}
          >
            <option value="Website">Website</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Email">Email</option>
            <option value="Referral">Referral</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Message
        </label>

        <textarea
          {...register("message")}
          rows={4}
          placeholder="What does the client need?"
          className={inputClass}
        />
      </div>

      <div className="flex justify-end gap-3 border-t border-slate-200 pt-5 dark:border-slate-800">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {isSubmitting
            ? "Saving..."
            : isEditing
              ? "Update Lead"
              : "Add Lead"}
        </button>
      </div>
    </form>
  );
}

export default LeadForm;