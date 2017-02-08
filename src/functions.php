<?php
namespace Wn\GitSplitter;

/**
 * The entry point
 *
 * @param  array $config
 * @param  array $args
 * @return void
 */
function run($config, $args) {
    echo shell_exec(handle($config, $args));
}

/**
 * generates the shell code to be executed according to given arguments.
 *
 * @param  array $config
 * @param  array $args
 * @return string
 */
function handle($config, $args) {
    if (count($args) < 2 || !in_array($args[0], ['add', 'checkout', 'commit', 'pull', 'push', 'tag', 'merge'])) {
        // Forward to git
        return call('git', $args);
    }

    $cmd = $args[0];
    array_shift($args);
    switch ($cmd) {
        case 'add': return git_add($config, $args);
        case 'checkout': return git_checkout($config, $args);
        case 'commit': return git_commit($config, $args);
        case 'pull': return git_pull($config, $args);
        case 'push': return git_push($config, $args);
        case 'tag': return git_tag($config, $args);
        case 'merge': return git_merge($config, $args);
        default: return error("Something went really wrong !"); // should never happen !
    }
}

/**
 * generates the shell code corresponding to running `git add` on the parent repo.
 *
 * @param  array $config
 * @param  array $args
 * @return string
 */
function git_add($config, $args) {
    if (count($args) < 1)
        return 'git add';
    $flags = array_filter($args, function($arg) {
        return '-' == substr($arg, 0, 1);
    });
    $args = array_filter($args, function($arg) {
        return '-' != substr($arg, 0, 1);
    });
    $args = array_map('Wn\\GitSplitter\\normalize_path', $args);
    $commands = [ call('git add', array_merge($args, $flags))];
    foreach (splits_paths($config) as $splitPath) {
        $splitPath = normalize_path($splitPath);
        $innerPaths = paths_inside($splitPath, $args);
        if (count($innerPaths) > 0) {
            $commands[] = call('cd', [$splitPath]);
            $commands[] = call('git add', array_merge($innerPaths, $flags));
            $commands[] = call('cd', [back_path($splitPath)]);
        }
    }

    return implode(' && ', $commands);
}

function git_checkout($args) {
    return error("Not implemented yet!");
}

function git_commit($args) {
    return error("Not implemented yet!");
}

function git_pull($args) {
    return error("Not implemented yet!");
}

function git_push($args) {
    return error("Not implemented yet!");
}

function git_tag($args) {
    return error("Not implemented yet!");
}

function git_merge($args) {
    return error("Not implemented yet!");
}

/**
 * generates a shell code corresponding to an error.
 *
 * @param  string $msg
 * @return string
 */
function error($msg) {
    return "echo \"Error: {$msg}\"";
}

/**
 * generates the shell code corresponding to the call of $command with $args.
 *
 * @param  string $command
 * @param  array $args
 * @return string
 */
function call($command, $args = []) {
    return $command . ' ' . join_args($args);
}

/**
 * Returns the splits paths from the configuration array.
 *
 * @param  array $config
 * @return array
 */
function splits_paths($config) {
    if (!isset($config['splits']))
        return [];
    return array_keys($config['splits']);
}

/**
 * Gets the path to go back from the given one.
 *
 * @param  string $path
 * @return string
 */
function back_path($path) {
    $level = path_level($path);
    if ($level < 0) {
        throw new \InvalidArgumentException("Error: {$path} is outside the repository !");
    }
    return (0 == $level) ? '.' : str_repeat('../', $level);
}

/**
 * Returns the level of a relative path.
 * ```php
 * path_level('aa/bb/'); //=> 2
 * path_level('aa'); //=> 1
 * path_level('../..'); //=> -2
 * path_level('.'); //=> 0
 * path_level('../aa/bb'); //=> 1
 * path_level('../aa/bb/../cc'); //=> 1
 * ```
 *
 * @param  string $path
 * @return int
 */
function path_level($path) {
    $path = rtrim($path, '/');
    $level = 0;
    foreach (explode('/', $path) as $dir) {
        if ($dir == '..') {
            $level --;
        } else if ($dir != '.') {
            $level ++;
        }
    }
    return $level;
}

/**
 * Gets the intersection of $subPath with the given $paths.
 *
 * @param  string $subPath
 * @param  array $paths
 * @return array
 */
function paths_inside($subPath, $paths) {
    $subLevel = path_level($subPath);
    $subPathLength = strlen($subPath);
    $result = [];
    foreach ($paths as $path) {
        $pathLength = strlen($path);
        $pathLevel = path_level($path);
        if ($path == $subPath || (
            $pathLevel < $subLevel && $pathLength < $subPathLength
            && '/' == $subPath[$pathLength]
            && substr($subPath, 0, $pathLength) == $path
        )) {

            return ['.'];
        }

        if(substr($path, 0, $subPathLength) == $subPath
            && '/' == $path[$subPathLength]) {
            $result[] = '.' . substr($path, $subPathLength);
        }
    }
    return $result;
}

/**
 * Construct command line arguments string from an array.
 *
 * @param  array $args
 * @return string
 */
function join_args($args) {
    return implode(' ', array_map(function($arg) {
        return '"' . str_replace('"', '\"', $arg) . '"';
    }, $args));
}

/**
 * Normalizes a relative path.
 *
 * @param  string $path
 * @return string
 */
function normalize_path($path) {
    if($path == '.') {
        return $path;
    }
    if ('./' != substr($path, 0, 2))
        $path = './' . $path;

    return rtrim($path, '/');
}
