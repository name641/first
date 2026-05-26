import { render, screen, waitFor } from '@testing-library/react'
import {
    MemoryRouter,
    Routes,
    Route
} from 'react-router-dom'

import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import TaskEdit from '../pages/TaskEdit'

// navigateモック
const mockNavigate = vi.fn()

vi.mock(
    'react-router-dom',
    async () => {
        const actual =
            await vi.importActual(
                'react-router-dom'
            )

        return {
            ...actual,
            useNavigate: () =>
                mockNavigate,
        }
    }
)

// fetchモック
globalThis.fetch = vi.fn()

const mockTask = {
    id: 1,
    title: 'Laravel勉強',
    description: 'Task機能作成',
    deadline: '2030-01-01',
    status: 'todo'
}

const renderTaskEdit = () => {
    return render(
        <MemoryRouter
            initialEntries={[
                '/taskedit/1'
            ]}
        >
            <Routes>
                <Route
                    path="/taskedit/:id"
                    element={<TaskEdit />}
                />
            </Routes>
        </MemoryRouter>
    )
}

describe(
    'TaskEdit',
    () => {

        beforeEach(() => {
            vi.clearAllMocks()

            mockNavigate.mockClear()

            localStorage.clear()

            localStorage.setItem(
                'token',
                'fake-token'
            )

            vi.mocked(
                globalThis.fetch
            ).mockImplementation(
                async (input) => {

                    const url =
                        String(input)

                    // user
                    if (
                        url.includes('/me')
                    ) {
                        return {
                            ok: true,
                            json: async () => ({
                                name: 'test user'
                            })
                        } as Response
                    }

                    // task取得
                    if (
                        url.includes('/tasks/1')
                    ) {
                        return {
                            ok: true,
                            json: async () =>
                                mockTask
                        } as Response
                    }

                    return {
                        ok: true
                    } as Response
                }
            )
        })

        test(
            '初期表示',
            async () => {

                renderTaskEdit()

                expect(
                    await screen.findByDisplayValue(
                        'Laravel勉強'
                    )
                ).toBeInTheDocument()

                expect(
                    screen.getByDisplayValue(
                        'Task機能作成'
                    )
                ).toBeInTheDocument()

            }
        )

        test(
            '更新成功',
            async () => {

                const user =
                    userEvent.setup()

                renderTaskEdit()

                await screen.findByDisplayValue(
                    'Laravel勉強'
                )

                const title =
                    screen.getByDisplayValue(
                        'Laravel勉強'
                    )

                await user.clear(
                    title
                )

                await user.type(
                    title,
                    'React勉強'
                )

                await user.click(
                    screen.getByRole(
                        'button',
                        {
                            name: /Update/i
                        }
                    )
                )

                expect(
                    mockNavigate
                ).toHaveBeenCalledWith(
                    '/functionlist'
                )

            }
        )

        test(
            '更新失敗',
            async () => {

                const user =
                    userEvent.setup()

                vi.mocked(
                    globalThis.fetch
                ).mockImplementation(
                    async (input, init) => {

                        const url =
                            String(input)

                        if (
                            init?.method ===
                            'PUT'
                        ) {
                            return {
                                ok: false
                            } as Response
                        }

                        if (
                            url.includes('/me')
                        ) {
                            return {
                                ok: true,
                                json: async () => ({
                                    name: 'test'
                                })
                            } as Response
                        }

                        return {
                            ok: true,
                            json: async () =>
                                mockTask
                        } as Response
                    }
                )

                renderTaskEdit()

                await screen.findByDisplayValue(
                    'Laravel勉強'
                )

                await user.click(
                    screen.getByRole(
                        'button',
                        {
                            name: /Update/i
                        }
                    )
                )

                expect(
                    await screen.findByText(
                        '更新失敗'
                    )
                ).toBeInTheDocument()

            }
        )

        test(
            '削除成功',
            async () => {

                const user =
                    userEvent.setup()

                renderTaskEdit()

                await screen.findByDisplayValue(
                    'Laravel勉強'
                )

                await user.click(
                    screen.getByRole(
                        'button',
                        {
                            name: /Delete/i
                        }
                    )
                )

                await user.type(
                    screen.getByPlaceholderText(
                        'DELETE'
                    ),
                    'DELETE'
                )

                await user.click(
                    screen.getByRole(
                        'button',
                        {
                            name: '削除'
                        }
                    )
                )

                expect(
                    mockNavigate
                ).toHaveBeenCalledWith(
                    '/functionlist'
                )

            }
        )

        test(
            '取得失敗',
            async () => {

                vi.mocked(
                    globalThis.fetch
                ).mockImplementation(
                    async (input) => {

                        const url =
                            String(input)

                        // me成功
                        if (
                            url.includes('/me')
                        ) {
                            return {
                                ok: true,
                                json: async () => ({
                                    name: 'test'
                                })
                            } as Response
                        }

                        // task失敗
                        if (
                            url.includes('/tasks/')
                        ) {
                            return {
                                ok: false
                            } as Response
                        }

                        throw new Error()
                    }
                )

                renderTaskEdit()

                await waitFor(
                    () => {
                        expect(
                            screen.getByText(
                                '取得失敗'
                            )
                        ).toBeInTheDocument()
                    }
                )

            }
        )

        test(
            'Back押下で一覧へ戻る',
            async () => {

                const user =
                    userEvent.setup()

                renderTaskEdit()

                await screen.findByDisplayValue(
                    'Laravel勉強'
                )

                await user.click(
                    screen.getByRole(
                        'button',
                        {
                            name: /Back/i
                        }
                    )
                )

                expect(
                    mockNavigate
                ).toHaveBeenCalledWith(
                    '/functionlist'
                )

            }
        )

        test(
            'DELETE入力で削除ボタンが有効になる',
            async () => {

                const user =
                    userEvent.setup()

                renderTaskEdit()

                await screen.findByDisplayValue(
                    'Laravel勉強'
                )

                // モーダル開く
                await user.click(
                    screen.getByRole(
                        'button',
                        {
                            name: /Delete/i
                        }
                    )
                )

                const deleteButton =
                    screen.getByRole(
                        'button',
                        {
                            name: '削除'
                        }
                    )

                // 最初は無効
                expect(
                    deleteButton
                ).toBeDisabled()

                // DELETE入力
                await user.type(
                    screen.getByPlaceholderText(
                        'DELETE'
                    ),
                    'DELETE'
                )

                // 有効になる
                expect(
                    deleteButton
                ).toBeEnabled()

            }
        )

        test(
            '削除失敗時にエラー表示',
            async () => {

                const user =
                    userEvent.setup()

                vi.mocked(
                    globalThis.fetch
                ).mockImplementation(
                    async (input, init) => {

                        const url =
                            String(input)

                        // user取得
                        if (
                            url.includes('/me')
                        ) {
                            return {
                                ok: true,
                                json: async () => ({
                                    name: 'test user'
                                })
                            } as Response
                        }

                        // task取得
                        if (
                            url.includes('/tasks/1')
                            && !init?.method
                        ) {
                            return {
                                ok: true,
                                json: async () =>
                                    mockTask
                            } as Response
                        }

                        // delete失敗
                        if (
                            init?.method ===
                            'DELETE'
                        ) {
                            return {
                                ok: false
                            } as Response
                        }

                        throw new Error()
                    }
                )

                renderTaskEdit()

                await screen.findByDisplayValue(
                    'Laravel勉強'
                )

                // モーダル表示
                await user.click(
                    screen.getByRole(
                        'button',
                        {
                            name: /Delete/i
                        }
                    )
                )

                // DELETE入力
                await user.type(
                    screen.getByPlaceholderText(
                        'DELETE'
                    ),
                    'DELETE'
                )

                // 削除実行
                await user.click(
                    screen.getByRole(
                        'button',
                        {
                            name: '削除'
                        }
                    )
                )

                expect(
                    await screen.findByText(
                        '削除失敗'
                    )
                ).toBeInTheDocument()

            }
        )

        test(
            'status変更して更新できる',
            async () => {

                const user =
                    userEvent.setup()

                renderTaskEdit()

                await screen.findByDisplayValue(
                    'Laravel勉強'
                )

                const fetchSpy =
                    vi.mocked(
                        globalThis.fetch
                    )

                // status変更
                await user.selectOptions(
                    screen.getByRole(
                        'combobox'
                    ),
                    'doing'
                )

                // 更新
                await user.click(
                    screen.getByRole(
                        'button',
                        {
                            name: /Update/i
                        }
                    )
                )

                expect(
                    fetchSpy
                ).toHaveBeenCalledWith(
                    expect.stringContaining(
                        '/tasks/1'
                    ),
                    expect.objectContaining({
                        method: 'PUT',
                        body: expect.stringContaining(
                            '"status":"doing"'
                        )
                    })
                )

            }
        )
    }
)