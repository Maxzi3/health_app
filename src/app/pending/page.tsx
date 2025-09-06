"use client";

import { useSession } from "next-auth/react";
import LogoutButton from "@/components/auth/LogoutButton";

export default function PendingPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-yellow-600">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              className="w-12 h-12"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Approval Pending
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Your account is currently under review
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Hello, Dr. {session?.user.name}
            </h3>
            <div className="space-y-4 text-sm text-gray-600">
              <p>
                Thank you for completing your profile! Your account is currently
                being reviewed by our admin team.
              </p>
              <p>
                This process typically takes 1-2 business days. You&apos;ll receive
                an email notification once your account has been approved.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-blue-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-800">
                      <strong>What happens next?</strong>
                      <br />
                      Our team will verify your medical credentials and approve
                      your account. Once approved, you&apos;ll have access to the
                      doctor dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <LogoutButton className="text-blue-600 hover:text-blue-500 text-sm" />
        </div>
      </div>
    </div>
  );
}
