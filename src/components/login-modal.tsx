'use client'

import { useState } from 'react'
import { DialogModal } from './dialog-modal'
import { useLanguage } from '@/i18n/context'
import { LOGIN_CONFIG } from '@/consts'
import { useLocalAuthStore } from '@/hooks/use-local-auth'

export function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useLanguage()
  const { login } = useLocalAuthStore()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setLoginError('')

    try {
      // 验证账号密码
      if (username === LOGIN_CONFIG.USERNAME && password === LOGIN_CONFIG.PASSWORD) {
        // 登录成功，设置本地登录状态
        login()
        onClose()
      } else {
        setLoginError(t('login.incorrect'))
      }
    } catch (error) {
      setLoginError(t('login.error'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DialogModal open={open} onClose={onClose} className='card w-[400px] max-sm:w-full p-6'>
      <h2 className='text-xl font-medium mb-4'>{t('login.title')}</h2>
      <p className='text-secondary mb-6'>{t('login.description')}</p>
      
      <form onSubmit={handleLogin} className='space-y-4'>
        <div>
          <label htmlFor='username' className='block text-sm font-medium mb-2'>
            {t('login.username')}
          </label>
          <input
            type='text'
            id='username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className='w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand'
            required
          />
        </div>
        
        <div>
          <label htmlFor='password' className='block text-sm font-medium mb-2'>
            {t('login.password')}
          </label>
          <input
            type='password'
            id='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand'
            required
          />
        </div>
        
        {loginError && (
          <div className='text-red-500 text-sm'>{loginError}</div>
        )}
        
        <div className='flex items-center justify-end gap-3'>
          <button
            type='button'
            onClick={onClose}
            className='px-4 py-2 border border-border rounded-lg hover:bg-secondary/10'
          >
            {t('login.cancel')}
          </button>
          <button
            type='submit'
            disabled={isLoading}
            className='px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 disabled:opacity-70'
          >
            {isLoading ? t('login.loading') : t('login.submit')}
          </button>
        </div>
      </form>
    </DialogModal>
  )
}
