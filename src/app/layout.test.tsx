import React from 'react'

jest.mock('next/font/google', () => ({
  Ubuntu: () => ({ className: 'ubuntu-font' }),
}))

jest.mock('@/components/providers/theme-provider', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

jest.mock('@/context/auth-context', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

describe('RootLayout', () => {
  let RootLayout: any

  beforeAll(() => {
    RootLayout = require('./layout').default
  })

  it('renders children correctly with pt-br html lang', () => {
    const testChild = <div data-testid="test-child">Test Child Content</div>
    const result = RootLayout({ children: testChild })

    expect(result.type).toBe('html')
    expect(result.props.lang).toBe('pt-br')
    expect(result.props.children.type).toBe('body')
  })

  it('applies ubuntu font class to body', () => {
    const testChild = <div>Test Content</div>
    const result = RootLayout({ children: testChild })
    const bodyElement = result.props.children

    expect(bodyElement.props.className).toBe('ubuntu-font')
  })
})
