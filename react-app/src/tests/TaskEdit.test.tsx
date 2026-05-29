import { render, screen, waitFor } from '@testing-library/react'
import {
    MemoryRouter,
    Routes,
    Route
} from 'react-router-dom'

import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import TaskEdit from '../pages/TaskEdit'
import * as userApi from '../services/user';
import * as taskApi from '../services/task';
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

            // user API（/me）
            vi.spyOn(userApi, 'getMe').mockResolvedValue({
                data: { name: 'test user' }
            } as any)

            // task取得
            vi.spyOn(taskApi, 'getTaskById').mockResolvedValue({
                data: mockTask
            } as any)

            // update
            vi.spyOn(taskApi, 'updateTask').mockResolvedValue({
                data: {}
            } as any)

            // delete
            vi.spyOn(taskApi, 'deleteTask').mockResolvedValue({
                data: {}
            } as any)
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

                vi.spyOn(taskApi, 'updateTask').mockRejectedValueOnce(new Error())

                renderTaskEdit()

                await screen.findByDisplayValue('Laravel勉強')

                await user.click(
                    screen.getByRole('button', { name: /Update/i })
                )

                expect(
                    await screen.findByText('更新失敗')
                ).toBeInTheDocument()
            })
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

        test('取得失敗', async () => {
            vi.spyOn(taskApi, 'getTaskById').mockRejectedValueOnce(new Error())

            renderTaskEdit()

            await waitFor(() => {
                expect(screen.getByText('取得失敗')).toBeInTheDocument()
            })
        })
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

                vi.spyOn(taskApi, 'deleteTask').mockRejectedValueOnce(new Error())

                renderTaskEdit()

                await screen.findByDisplayValue('Laravel勉強')

                await user.click(screen.getByRole('button', { name: /Delete/i }))
                await user.type(screen.getByPlaceholderText('DELETE'), 'DELETE')
                await user.click(screen.getByRole('button', { name: '削除' }))

                expect(
                    await screen.findByText('削除失敗')
                ).toBeInTheDocument()
            })

        test('status変更して更新できる', async () => {
            const user = userEvent.setup()

            renderTaskEdit()

            await screen.findByDisplayValue('Laravel勉強')

            const updateSpy = vi.spyOn(taskApi, 'updateTask')

            await user.selectOptions(
                screen.getByRole('combobox'),
                'doing'
            )

            await user.click(
                screen.getByRole('button', { name: /Update/i })
            )

            // =========================
            // 呼び出し検証（正しい形）
            // =========================
            expect(updateSpy).toHaveBeenCalledWith(
                '1', // task id（URL /taskedit/1 から）
                expect.objectContaining({
                    status: 'doing'
                }),
                'fake-token' // localStorageのtoken
            )
        })
    })