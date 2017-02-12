<?php
namespace Wn\GitSplitter\Tests;

use Wn\GitSplitter as S;

class UnitTests extends TestCase {

    function test_handle() {

    }

    function test_git_add() {
        $config = ['splits' => [
            'src/A' => '...',
            'src/B' => '...',
            'src/utils/C' => '...'
        ]];

        $this->assertAll([
            [
                S\git_add($config, ['.']),
                'git add "." && cd "./src/A" && git add "." && cd "../../" && cd "./src/B" && git add "." && cd "../../" && cd "./src/utils/C" && git add "." && cd "../../../"'
            ], [
                S\git_add($config, ['src']),
                'git add "./src" && cd "./src/A" && git add "." && cd "../../" && cd "./src/B" && git add "." && cd "../../" && cd "./src/utils/C" && git add "." && cd "../../../"'
            ], [
                S\git_add($config, ['src', 'src/A']),
                'git add "./src" "./src/A" && cd "./src/A" && git add "." && cd "../../" && cd "./src/B" && git add "." && cd "../../" && cd "./src/utils/C" && git add "." && cd "../../../"'
            ], [
                S\git_add($config, ['src/A/foo', 'src/A/foo/bar']),
                'git add "./src/A/foo" "./src/A/foo/bar" && cd "./src/A" && git add "./foo" "./foo/bar" && cd "../../"'
            ], [
                S\git_add($config, ['src/A/foo', 'src/other']),
                'git add "./src/A/foo" "./src/other" && cd "./src/A" && git add "./foo" && cd "../../"'
            ], [
                S\git_add($config, ['src/A/foo', 'src/B/bar', 'src/other']),
                'git add "./src/A/foo" "./src/B/bar" "./src/other" && cd "./src/A" && git add "./foo" && cd "../../" && cd "./src/B" && git add "./bar" && cd "../../"'
            ], [
                S\git_add($config, ['src/A/foo', '--all']),
                'git add "./src/A/foo" "--all" && cd "./src/A" && git add "./foo" "--all" && cd "../../"'
            ], [
                S\git_add($config, ['-f', 'src/A/foo', '--verbose']),
                'git add "./src/A/foo" "-f" "--verbose" && cd "./src/A" && git add "./foo" "-f" "--verbose" && cd "../../"'
            ]
        ]);
    }

    function test_git_checkout() {

    }

    function test_git_commit() {

    }

    function test_git_pull() {

    }

    function test_git_push() {

    }

    function test_git_tag() {

    }

    function test_git_merge() {

    }

    function test_error() {
        $this->assertEquals('echo "Error: Ooops !"',
            S\error('Ooops !'));
    }

    function test_call() {
        $this->assertEquals('git commit -m "Hello World !"',
            S\call('git commit -m', ['Hello World !']));
    }

    function test_splits_paths() {
        $this->assertAll([
            [S\splits_paths(['splits' => [
                'src/A' => '....',
                'src/utils/B' => '....'
            ]]), ['src/A', 'src/utils/B']],
            [S\splits_paths(['splits' => []]), []],
            [S\splits_paths([]), []]
        ]);
    }

    function test_back_path() {
        $this->assertAll([
            [S\back_path('aa/bb/'), '../../'],
            [S\back_path('aa/../bb/'), '../'],
            [S\back_path('aa/../bb/../'), '.'],
            [S\back_path('./'), '.']
        ]);
    }

    /**
     * @expectedException \InvalidArgumentException
     */
    function test_back_path_outside() {
        S\back_path('../');
    }

    function test_path_level() {
        $this->assertAll([
            [S\path_level('aa/bb/'), 2],
            [S\path_level('aa'), 1],
            [S\path_level('../..'), -2],
            [S\path_level('.'), 0],
            [S\path_level('../aa/bb'), 1],
            [S\path_level('../aa/bb/../cc'), 1]
        ]);
    }

    function test_paths_inside() {
        $this->assertAll([
            [S\paths_inside('aa/bb',
                ['aa/bb/cc', 'aa/cc', 'dd', 'aa/bb/ee/cc/t']),
                ['./cc', './ee/cc/t']
            ],
            [S\paths_inside('aa/bb',
                ['aa/bb/cc', 'aa/cc', 'aa', 'aa/bb/ee/cc/t']),
                ['.']
            ],
            [S\paths_inside('aa/bb',
                ['aa/bba/cc', 'aa/cc', 'dd', 'aa/ee/cc/t']),
                []
            ]
        ]);
    }

    function test_join_args() {
        $this->assertEquals(S\join_args([
            'a', 'hello world', 'This is "string" here'
        ]), '"a" "hello world" "This is \"string\" here"');
    }
}
