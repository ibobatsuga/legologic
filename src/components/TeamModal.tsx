'use client';

import React, { useState } from 'react';
import { Organization, TeamMember, Role } from '@/types/legologic';
import { X, UserPlus, Users, Shield, Trash2, Mail, Check } from 'lucide-react';

interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  organization: Organization;
  members: TeamMember[];
  onInviteMember: (email: string, name: string, role: Role) => void;
  onRemoveMember: (id: string) => void;
}

export function TeamModal({
  isOpen,
  onClose,
  organization,
  members,
  onInviteMember,
  onRemoveMember,
}: TeamModalProps) {
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<Role>('MEMBER');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    onInviteMember(inviteEmail, inviteName || inviteEmail.split('@')[0], inviteRole);
    setInviteEmail('');
    setInviteName('');
    setSuccessMsg(`Undangan berhasil dikirim ke ${inviteEmail}`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Tim & Kolaborasi Organisasi</h2>
              <p className="text-xs text-slate-500">{organization.name} · Paket {organization.plan}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Invite Form */}
          <form onSubmit={handleSubmit} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <UserPlus className="w-4 h-4 text-blue-600" />
              <span>Undang Anggota Tim Baru via Email</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Nama Lengkap"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                className="text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                required
                placeholder="Alamat Email Tim"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span>Peran:</span>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as Role)}
                  className="text-xs bg-white border border-slate-200 rounded-lg px-2 py-1 font-semibold text-slate-700"
                >
                  <option value="MEMBER">Member (Edit App & Data)</option>
                  <option value="VIEWER">Viewer (Hanya Lihat Preview)</option>
                  <option value="OWNER">Co-Owner (Akses Penuh)</option>
                </select>
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Kirim Undangan</span>
              </button>
            </div>

            {successMsg && (
              <div className="text-xs font-medium text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-200 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                {successMsg}
              </div>
            )}
          </form>

          {/* Members List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700">Daftar Anggota ({members.length})</h4>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
              {members.map(member => (
                <div key={member.id} className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                        {member.name}
                        {member.role === 'OWNER' && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                            Owner
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400">{member.email}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] px-2 py-0.5 rounded-md font-medium text-slate-600 bg-slate-100">
                      {member.status === 'active' ? 'Aktif' : 'Menunggu Terima'}
                    </span>
                    {member.role !== 'OWNER' && (
                      <button
                        onClick={() => onRemoveMember(member.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-md"
                        title="Hapus akses"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-xl"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
