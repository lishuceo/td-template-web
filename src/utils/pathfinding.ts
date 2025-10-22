import type { PathPoint } from '@/types/game';

/**
 * 计算路径总长度
 */
export function calculatePathLength(path: PathPoint[]): number {
  let length = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const dx = path[i + 1].x - path[i].x;
    const dy = path[i + 1].y - path[i].y;
    length += Math.sqrt(dx * dx + dy * dy);
  }
  return length;
}

/**
 * 根据路径进度获取位置
 * @param path 路径点数组
 * @param progress 进度 (0-1)
 */
export function getPositionOnPath(path: PathPoint[], progress: number): PathPoint {
  if (progress <= 0) return { ...path[0] };
  if (progress >= 1) return { ...path[path.length - 1] };

  const totalLength = calculatePathLength(path);
  const targetDistance = totalLength * progress;

  let currentDistance = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const start = path[i];
    const end = path[i + 1];
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const segmentLength = Math.sqrt(dx * dx + dy * dy);

    if (currentDistance + segmentLength >= targetDistance) {
      // 在这段上
      const segmentProgress = (targetDistance - currentDistance) / segmentLength;
      return {
        x: start.x + dx * segmentProgress,
        y: start.y + dy * segmentProgress,
      };
    }

    currentDistance += segmentLength;
  }

  return { ...path[path.length - 1] };
}

/**
 * 计算两点之间的距离
 */
export function distance(p1: PathPoint, p2: PathPoint): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * 平滑路径（贝塞尔曲线）
 */
export function smoothPath(path: PathPoint[], segments = 20): PathPoint[] {
  if (path.length < 3) return path;

  const smoothed: PathPoint[] = [path[0]];

  for (let i = 0; i < path.length - 2; i++) {
    const p0 = path[i];
    const p1 = path[i + 1];
    const p2 = path[i + 2];

    for (let t = 0; t <= 1; t += 1 / segments) {
      const x = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
      const y = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;
      smoothed.push({ x, y });
    }
  }

  smoothed.push(path[path.length - 1]);
  return smoothed;
}
