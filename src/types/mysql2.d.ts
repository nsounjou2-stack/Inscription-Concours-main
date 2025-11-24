// Déclarations de types pour mysql2
declare module 'mysql2' {
  import { Pool, Connection } from 'mysql2/typings/mysql';

  export = mysql2;
}

declare module 'mysql2/promise' {
  import { Pool, Connection, QueryOptions } from 'mysql2/typings/mysql';
  
  export function createPool(config: PoolConfig): Pool;
  export function createConnection(config: ConnectionConfig): Promise<Connection>;
  
  export interface PoolConfig {
    host?: string;
    port?: number;
    user?: string;
    password?: string;
    database?: string;
    waitForConnections?: boolean;
    connectionLimit?: number;
    queueLimit?: number;
    [key: string]: any;
  }
  
  export interface ConnectionConfig {
    host?: string;
    port?: number;
    user?: string;
    password?: string;
    database?: string;
    [key: string]: any;
  }
}

declare module 'mysql2/typings/mysql' {
  export interface Pool {
    getConnection(): Promise<Connection>;
    end(): Promise<void>;
  }
  
  export interface Connection {
    execute(sql: string, values?: any[]): Promise<[any, any]>;
    query(sql: string, values?: any[]): Promise<[any, any]>;
    release(): void;
    beginTransaction(): Promise<void>;
    commit(): Promise<void>;
    rollback(): Promise<void>;
  }
}