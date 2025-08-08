
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';




export  function AvatarSkeleton({ rows = 2, columns = 2 }) {
 return (
    <tbody>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <td key={colIndex} className="px-4 py-3">
              <Skeleton height={20} />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
