import {
    render,
    screen
} from '@testing-library/react'

import {
    MemoryRouter
} from 'react-router-dom'

import {
    vi,
    describe,
    beforeEach,
    test,
    expect
} from 'vitest'

import userEvent from '@testing-library/user-event'

import FeatureList from '../pages/FunctionList'

// =====================
// navigateモック
// =====================

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

// =====================
// fetchモック
// =====================

globalThis.fetch = vi.fn()

const mockTasks = [
    {
        id: 1,
        title: '期限切れTask',
        description: 'old',
        status: 'todo',
        deadline: '2020-01-01',
    },

    {
        id: 2,
        title: '未来Task',
        description: 'future',
        status: 'doing',
        deadline: '2030-01-01',
    },

    {
        id: 3,
        title: 'Laravel勉強',
        description: 'Task機能作成',
        status: 'todo',
        deadline: '2030-01-02',
    }
]

// =====================
// render共通化
// =====================

const renderFeatureList =
    () => {
        return render(
            <MemoryRouter>
                <FeatureList />
            </MemoryRouter>
        )
    }

// =====================
// test
// =====================

describe(
    'FeatureList',
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
            )

                // tasks取得
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () =>
                        mockTasks,
                } as Response)

                // user取得
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => ({
                        id: 1,
                        name: 'test user'
                    }),
                } as Response)

        })

        test(
            'タスク一覧表示',
            async () => {

                renderFeatureList()

                expect(
                    await screen.findByText(
                        'Laravel勉強'
                    )
                ).toBeInTheDocument()

                expect(
                    screen.getByText(
                        '未来Task'
                    )
                ).toBeInTheDocument()

                expect(
                    screen.getByText(
                        '期限切れTask'
                    )
                ).toBeInTheDocument()

            })

        test(
            '検索でタスクを絞り込める',
            async () => {

                const user =
                    userEvent.setup()

                renderFeatureList()

                await screen.findByText(
                    'Laravel勉強'
                )

                const searchInput =
                    screen.getByPlaceholderText(
                        'タスクを検索...'
                    )

                await user.type(
                    searchInput,
                    'Laravel'
                )

                expect(
                    screen.getByText(
                        'Laravel勉強'
                    )
                ).toBeInTheDocument()

                expect(
                    screen.queryByText(
                        '未来Task'
                    )
                ).not.toBeInTheDocument()

                expect(
                    screen.queryByText(
                        '期限切れTask'
                    )
                ).not.toBeInTheDocument()

            })

        test(
            '期限切れフィルタで絞り込める',
            async () => {

                const user =
                    userEvent.setup()

                renderFeatureList()

                await screen.findByText(
                    '期限切れTask'
                )

                const select =
                    screen.getByRole(
                        'combobox'
                    )

                await user.selectOptions(
                    select,
                    'overdue'
                )

                expect(
                    screen.getByText(
                        '期限切れTask'
                    )
                ).toBeInTheDocument()

                expect(
                    screen.queryByText(
                        '未来Task'
                    )
                ).not.toBeInTheDocument()

                expect(
                    screen.queryByText(
                        'Laravel勉強'
                    )
                ).not.toBeInTheDocument()

            })

        test(
            '+ New Task押下で画面遷移',
            async () => {

                const user =
                    userEvent.setup()

                renderFeatureList()

                await screen.findByText(
                    'Laravel勉強'
                )

                await user.click(
                    screen.getByRole(
                        'button',
                        {
                            name:
                                /\+ New Task/i
                        }
                    )
                )

                expect(
                    mockNavigate
                ).toHaveBeenCalledWith(
                    '/taskscreate'
                )

            })

        test(
            'ログアウトでtoken削除してトップへ戻る',
            async () => {

                const user =
                    userEvent.setup()

                renderFeatureList()

                await screen.findByText(
                    'Laravel勉強'
                )

                const buttons =
                    screen.getAllByRole(
                        'button'
                    )

                await user.click(
                    buttons[1]
                )

                await user.click(
                    screen.getByText(
                        /Logout/i
                    )
                )

                expect(
                    localStorage.getItem(
                        'token'
                    )
                ).toBeNull()

                expect(
                    mockNavigate
                ).toHaveBeenCalledWith(
                    '/'
                )

            })

        test(
            'ユーザー取得失敗時にエラー表示',
            async () => {

                vi.resetAllMocks()

                localStorage.clear()

                localStorage.setItem(
                    'token',
                    'fake-token'
                )

                globalThis.fetch =
                    vi.fn()

                vi.mocked(
                    globalThis.fetch
                )

                    // tasks成功
                    .mockResolvedValueOnce({
                        ok: true,
                        status: 200,
                        json: async () =>
                            mockTasks,
                    } as Response)

                    // me失敗
                    .mockResolvedValueOnce({
                        ok: false,
                        status: 500,
                        json: async () => ({})
                    } as Response)

                renderFeatureList()

                const alert =
                    await screen.findByRole(
                        'alert'
                    )

                expect(
                    alert
                ).toHaveTextContent(
                    'ユーザー情報の取得に失敗しました'
                )

            })

        test(
            '401ならログアウトしてトップへ戻る',
            async () => {

                vi.resetAllMocks()

                localStorage.clear()

                localStorage.setItem(
                    'token',
                    'fake-token'
                )

                globalThis.fetch =
                    vi.fn()

                vi.mocked(
                    globalThis.fetch
                )

                    // tasksが401
                    .mockResolvedValueOnce({
                        ok: false,
                        status: 401,
                        json: async () => ({})
                    } as Response)

                renderFeatureList()

                await screen.findByText(
                    'タスクがありません'
                )

                expect(
                    localStorage.getItem(
                        'token'
                    )
                ).toBeNull()

                expect(
                    mockNavigate
                ).toHaveBeenCalledWith(
                    '/'
                )

            })

        test(
            'タスクカード押下で編集画面へ遷移',
            async () => {

                const user =
                    userEvent.setup()

                renderFeatureList()

                await screen.findByText(
                    'Laravel勉強'
                )

                await user.click(
                    screen.getByText(
                        'Laravel勉強'
                    )
                )

                expect(
                    mockNavigate
                ).toHaveBeenCalledWith(
                    '/taskedit/3'
                )

            })

        test(
            'タスク0件なら空画面表示',
            async () => {

                vi.resetAllMocks()

                localStorage.clear()

                localStorage.setItem(
                    'token',
                    'fake-token'
                )

                globalThis.fetch =
                    vi.fn()

                vi.mocked(
                    globalThis.fetch
                )

                    // tasks空
                    .mockResolvedValueOnce({
                        ok: true,
                        status: 200,
                        json: async () => [],
                    } as Response)

                    // user取得
                    .mockResolvedValueOnce({
                        ok: true,
                        status: 200,
                        json: async () => ({
                            id: 1,
                            name: 'test user'
                        }),
                    } as Response)

                renderFeatureList()

                expect(
                    await screen.findByText(
                        'タスクがありません'
                    )
                ).toBeInTheDocument()

                expect(
                    screen.getByText(
                        '「+ New Task」から追加してください'
                    )
                ).toBeInTheDocument()

            })
    })